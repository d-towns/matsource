import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type SchemaDescription = {
  type: string;
  optional?: boolean;
  nullable?: boolean;
  description?: string;
  properties?: Record<string, SchemaDescription>;
  items?: SchemaDescription;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

function describeZodSchema(schema: z.ZodTypeAny): SchemaDescription {
  const def = schema._def;
  
  // Handle optional and nullable
  if (schema instanceof z.ZodOptional) {
    return { ...describeZodSchema(def.innerType), optional: true };
  }
  if (schema instanceof z.ZodNullable) {
    return { ...describeZodSchema(def.innerType), nullable: true };
  }

  // Basic types
  if (schema instanceof z.ZodString) {
    const desc: SchemaDescription = { type: 'string' };
    if (def.minLength !== null) desc.minLength = def.minLength;
    if (def.maxLength !== null) desc.maxLength = def.maxLength;
    if (def.checks) {
      def.checks.forEach((check: any) => {
        if (check.kind === 'regex') desc.pattern = check.regex.source;
      });
    }
    return desc;
  }
  
  if (schema instanceof z.ZodNumber) {
    const desc: SchemaDescription = { type: 'number' };
    if (def.checks) {
      def.checks.forEach((check: any) => {
        if (check.kind === 'min') desc.minimum = check.value;
        if (check.kind === 'max') desc.maximum = check.value;
      });
    }
    return desc;
  }
  
  if (schema instanceof z.ZodBoolean) return { type: 'boolean' };
  
  // Complex types
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, SchemaDescription> = {};
    for (const [key, value] of Object.entries(def.shape())) {
      properties[key] = describeZodSchema(value as z.ZodTypeAny);
    }
    return { type: 'object', properties };
  }
  
  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: describeZodSchema(def.type)
    };
  }
  
  if (schema instanceof z.ZodEnum) {
    return {
      type: 'enum',
      enum: def.values
    };
  }
  
  // Default fallback
  return { type: 'unknown' };
}

function stringifySchemaDescription(desc: SchemaDescription, indent = 0): string {
  const spaces = ' '.repeat(indent);
  let result = '';
  
  if (desc.description) {
    result += `${spaces}// ${desc.description}\n`;
  }
  
  const modifiers = [
    desc.optional && 'optional',
    desc.nullable && 'nullable'
  ].filter(Boolean).join(', ');
  
  result += `${spaces}${desc.type}${modifiers ? ` (${modifiers})` : ''}`;
  
  if (desc.enum) {
    result += ` = ${JSON.stringify(desc.enum)}`;
  }
  
  if (desc.minimum !== undefined || desc.maximum !== undefined) {
    const range = [
      desc.minimum !== undefined ? desc.minimum : '-∞',
      desc.maximum !== undefined ? desc.maximum : '∞'
    ];
    result += ` range:[${range.join(', ')}]`;
  }
  
  if (desc.minLength !== undefined || desc.maxLength !== undefined) {
    const length = [
      desc.minLength !== undefined ? desc.minLength : '0',
      desc.maxLength !== undefined ? desc.maxLength : '∞'
    ];
    result += ` length:[${length.join(', ')}]`;
  }
  
  if (desc.pattern) {
    result += ` pattern:${desc.pattern}`;
  }
  
  if (desc.properties) {
    result += ' {\n';
    for (const [key, value] of Object.entries(desc.properties)) {
      result += `${spaces}  ${key}: ${stringifySchemaDescription(value, indent + 2)}\n`;
    }
    result += `${spaces}}`;
  }
  
  if (desc.items) {
    result += `[\n${spaces}  ${stringifySchemaDescription(desc.items, indent + 2)}\n${spaces}]`;
  }
  
  return result;
}

// Function to convert a Zod schema to a string
export function zodSchemaToString(schema: z.ZodTypeAny): string {
  const description = describeZodSchema(schema);
  return stringifySchemaDescription(description);
}
