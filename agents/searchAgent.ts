// agent.ts

// IMPORTANT - Add your API keys here. Be careful not to publish them.

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, BaseMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation, Annotation, messagesStateReducer, START, END } from "@langchain/langgraph";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { StagehandExtractTool, StagehandActTool, StagehandNavigateTool, StagehandObserveTool } from "@langchain/community/agents/toolkits/stagehand";
import { Stagehand } from "@browserbasehq/stagehand"
import * as tslab from "tslab";

// Define types for inputs and results.
export interface SearchParams {
  carName: string;
  year: number;
  issues: string;
  location: string;
  budget?: number;
  preferredBrands?: string[];
  recycledParts?: boolean;
  retailParts?: boolean;
}

export interface PartIdentificationResult {
  parts: string[];
}

export interface StoreInfo {
  id: string;
  name: string;
  phone?: string;
  location: string;
  url?: string; // Added url to StoreInfo
}

export interface AvailabilityResult {
  store: StoreInfo;
  availableParts: { part: string; year: string; model: string; grade: string; stockNumber: string; price: string; distance: string; deliveryTime: string; inStock: boolean; url: string }[];
}

export interface SearchAgentResult {
  identifiedParts: string[];
  storeResults: AvailabilityResult[];
}

//###################################################################################################
//#  RETAIL PARTS AGENT AND TOOLS                                                                 #
//###################################################################################################

// 1. Define the Tavily Search Tool
const tavilySearch = new TavilySearchResults({ maxResults: 3 });

const performTavilySearch = tool(
  async (input: { query: string }) => {
    try {
      const results = await tavilySearch.invoke(input.query);
      console.log("Tavily search results:", results);
      return results;

    } catch (error) {
      console.error("Error during Tavily search:", error);
      return "Error occurred during search.";
    }
  },
  {
    name: "tavily_search",
    description: "Useful for searching the web to find parts at retail stores",
    schema: z.object({
      query: z.string().describe("The search query to use.")
    }),
  }
);

// 2. Define the Response Schema and Tool
const RetailResponseSchema = z.object({
  identifiedParts: z.array(z.string()).describe("List of identified parts"),
  storeResults: z.array(
    z.object({
      store: z.object({
        id: z.string().describe("Store ID"),
        name: z.string().describe("Store Name"),
        phone: z.string().optional().describe("Store Phone Number"),
        location: z.string().describe("Store Location"),
        url: z.string().optional().describe("Store URL"),
      }),
      availableParts: z.array(
        z.object({
          part: z.string().describe("Part Name"),
          year: z.string().describe("Year of the part"),
          model: z.string().describe("Model of the part"),
          grade: z.string().describe("Grade of the part"),
          stockNumber: z.string().describe("Stock Number of the part"),
          price: z.string().describe("Part Price"),
          distance: z.string().describe("Distance to the store"),
          deliveryTime: z.string().describe("Part Delivery Time"),
          inStock: z.boolean().describe("Is the part in stock?"),
          url: z.string().describe("URL to the part on the store's website"),
        })
      ).describe("List of available parts in the store"),
    })
  ).describe("List of store results"),
});

const retailFinalResponseTool = tool(
  async (input: z.infer<typeof RetailResponseSchema>) => {
    // This tool's purpose is to enforce the schema.  The agent should call this to return the final result.
    return JSON.stringify(input);
  },
  {
    name: "retail_final_response",
    description: "Always respond to the user using this tool with the final answer when searching for retail parts.",
    schema: RetailResponseSchema,
  }
);

const retailTools = [performTavilySearch, retailFinalResponseTool];
const retailToolNode = new ToolNode<typeof GraphState.State>(retailTools);

// Create the retail parts agent model
const retailPartsModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
}).bindTools(retailTools);

//###################################################################################################
//#  RECYCLED PARTS AGENT AND TOOLS                                                               #
//###################################################################################################



// Create the recycled parts agent model

const RecycledResponseSchema = z.object({
  identifiedParts: z.array(z.string()).describe("List of identified parts"),
  storeResults: z.array(
    z.object({
      store: z.object({
        id: z.string().describe("Store ID"),
        name: z.string().describe("Store Name"),
        phone: z.string().optional().describe("Store Phone Number"),
        location: z.string().describe("Store Location"),
        url: z.string().optional().describe("Store URL"),
      }),
      availableParts: z.array(
        z.object({
          part: z.string().describe("Part Name"),
          year: z.string().describe("Year of the part"),
          model: z.string().describe("Model of the part"),
          grade: z.string().describe("Grade of the part"),
          stockNumber: z.string().describe("Stock Number of the part"),
          price: z.string().describe("Part Price"),
          distance: z.string().describe("Distance to the store"),
          deliveryTime: z.string().describe("Part Delivery Time"),
          inStock: z.boolean().describe("Is the part in stock?"),
          url: z.string().describe("URL to the part on the store's website"),
        })
      ).describe("List of available parts in the store"),
    })
  ).describe("List of store results"),
});

const recycledFinalResponseTool = tool(
  async (input: z.infer<typeof RecycledResponseSchema>) => {
    // This tool's purpose is to enforce the schema.  The agent should call this to return the final result.
    return JSON.stringify(input);
  },
  {
    name: "recycled_final_response",
    description: "Always respond to the user using this tool with the final results of the completed search when searching for recycled parts.",
    schema: RecycledResponseSchema,
  }
);

const stagehand = new Stagehand({
  env: "LOCAL",
  headless: false,
  verbose: 2,
  debugDom: true,
  enableCaching: false,
})



const navigateTool = new StagehandNavigateTool(stagehand);
const observeTool = new StagehandObserveTool(stagehand);
const extractTool = new StagehandExtractTool(stagehand);
console.log("extractTOol", extractTool);
const actTool = new StagehandActTool(stagehand);

const recycledTools = [navigateTool, observeTool, actTool, extractTool, recycledFinalResponseTool];
const recycledToolNode = new ToolNode<typeof GraphState.State>(recycledTools);

const recycledPartsModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
}).bindTools(recycledTools);

//###################################################################################################
//#  ORCHESTRATOR AGENT AND TOOLS                                                                 #
//###################################################################################################

// Define the tool for the orchestrator to choose the next agent
const routeToAgent = tool(
  async (input: { next_agent: "retail_parts_agent" | "recycled_parts_agent", query: string }) => {
    return input.next_agent
  },
  {
    name: "route_to_agent",
    description: "Routes the request to the appropriate agent based on the user's request.",
    schema: z.object({
      next_agent: z.enum(["retail_parts_agent", "recycled_parts_agent"]).describe("The agent to route to."),
      query: z.string().describe("The query to pass to the agent."),
    }),
  }
);

// Create the orchestrator model
const orchestratorModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
}).bindTools([routeToAgent]);

//###################################################################################################
//#  DEFINE SHARED STATE GRAPH                                                                     #
//###################################################################################################

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
  searchParams: Annotation<SearchParams>,
  searchStep: Annotation<string>
});


//###################################################################################################
//#  DEFINE AGENT NODES                                                                           #
//###################################################################################################

// 1. Orchestrator Agent Node
async function callOrchestrator(state: typeof GraphState.State,) {
  try {

    const response = await orchestratorModel.invoke(state.messages);

    return { messages: [response], next: "route" };
  } catch (error: any) {
    console.error("Error invoking orchestrator model:", error);
    throw error;
  }
}

// 2. Retail Parts Agent Node
async function callRetailPartsAgent(state: typeof GraphState.State,) {
  // Define the tools for the retail parts agent

  try {
    const response = await retailPartsModel.invoke(state.messages);
    return { messages: [response], next: "route" };
  } catch (error: any) {
    console.error("Error invoking retail parts agent model:", error);
    throw error;
  }
}

// 3. Recycled Parts Agent Node
async function callRecycledPartsAgent(state: typeof GraphState.State,) {

  
  // Define the tools for the recycled parts agent


  try {

    console.log("calling recycled parts agent");
    console.log(state.messages[state.messages.length - 1]);
    console.log(state.searchStep); 

    const lastMessage = state.messages[state.messages.length - 1]
    if(lastMessage instanceof ToolMessage) {
      const toolMessage = lastMessage as ToolMessage;
      if(state.searchStep === "initialFormSubmitted") {
        const recycledPartsPrompt = `If there is a form on the page, submit it.`;
        const response = await recycledPartsModel.invoke(recycledPartsPrompt);
        return { messages: [response], next: "route", searchStep: "extraFormSubmitted" };
      }
    }

    if(state.searchStep === "extraFormSubmitted") {
      const recycledPartsPrompt = `extract the data from the page and return the results in a structured JSON format.`;
      const response = await recycledPartsModel.invoke(recycledPartsPrompt);
      return { messages: [response], next: "route", searchStep: "dataExtracted" };
    }

    // right now, this model is being called with the entire message history.
    // it doesnt know that it should only go to car-parts.com to search for parts.
    // it should be able to navigate to the page, fill out the form based on the first prompt in the message history, and extract the data.
    await stagehand.init();
    const { carName, year, issues, location, budget, preferredBrands, recycledParts, retailParts } = state.searchParams;
    const recycledPartsPrompt = `navigate to car-part.com and act on the form to search for ${carName} ${year} ${issues} ${location}. `
    const response = await recycledPartsModel.invoke(recycledPartsPrompt);
    return { messages: [response], next: "route", searchStep: "initialFormSubmitted" };
  } catch (error: any) {
    console.error("Error invoking recycled parts agent model:", error);
    throw error;
  }
}

//###################################################################################################
//#  DEFINE ROUTING LOGIC                                                                         #
//###################################################################################################

// 1. Define the function that routes to the next agent
function route({ messages, searchParams }: typeof GraphState.State) {
  if(searchParams.recycledParts) {
    return "recycled_parts_agent";
  } else {
    return "retail_parts_agent";
  }
}

function recycledPartsAgentRoute({ messages, searchParams }: typeof GraphState.State) {
  // if there are tools calls, then route to the tools node
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if(lastMessage.tool_calls && lastMessage.tool_calls[lastMessage.tool_calls?.length -1].name === "recycled_final_response") {
    return "__end__";
  } else {
    return "recycled_parts_agent_tools";
  }
}

function retailPartsAgentRoute({ messages, searchParams }: typeof GraphState.State) {
  // if there are tools calls, then route to the tools node
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if(lastMessage.tool_calls && lastMessage.tool_calls[lastMessage.tool_calls?.length -1].name === "retail_final_response") {
    return "__end__";
  } else {
    return "retail_parts_agent_tools";
  }
}





//###################################################################################################
//#  CREATE LANGGRAPH WORKFLOW                                                                     #
//###################################################################################################

const workflow = new StateGraph(GraphState)
  .addNode("orchestrator", callOrchestrator)
  .addNode("retail_parts_agent", callRetailPartsAgent)
  .addNode("recycled_parts_agent", callRecycledPartsAgent)
  .addNode("recycled_parts_agent_tools", recycledToolNode)
  .addNode("retail_parts_agent_tools", retailToolNode)
  .addEdge("retail_parts_agent_tools", "retail_parts_agent")
  .addEdge("recycled_parts_agent_tools", "recycled_parts_agent")
  .addConditionalEdges("orchestrator", route, {
    retail_parts_agent: "retail_parts_agent",
    recycled_parts_agent: "recycled_parts_agent",
  })
  .addConditionalEdges("recycled_parts_agent", recycledPartsAgentRoute, {
    recycled_parts_agent_tools: "recycled_parts_agent_tools",
    __end__: END,
  })
  .addConditionalEdges("retail_parts_agent", retailPartsAgentRoute, {
    __end__: END,
    retail_parts_agent_tools: "retail_parts_agent_tools",
  })
  .addEdge(START, "orchestrator")

  const PartSearchAgent = workflow.compile();


//###################################################################################################
//#  RUN THE AGENT                                                                                #
//###################################################################################################

export async function runSearchWorkflow(params: SearchParams): Promise<any> {
  console.log(params.recycledParts)

  const searchPrompt = `
    You are an expert system designed to find car parts for users. You will be given information about the car, the issues it's experiencing, and the user's preferences. Your goal is to find the best possible parts for the user, and return the results in a structured JSON format.

    Car Name: ${params.carName}
    Year: ${params.year}
    Issues: ${params.issues}
    Location: ${params.location}
    Budget: ${params.budget || "N/A"}
    Preferred Brands: ${params.preferredBrands ? params.preferredBrands.join(", ") : "N/A"}
    
    Search for ${params.recycledParts ? "recycled" : "retail"} parts for the user.
    `;

  try {
    const config = {
      recursionLimit: 100,
    }
    const state = await PartSearchAgent.invoke({
      messages: [new HumanMessage(searchPrompt)],
      searchParams: params
    },
      config
    );

    console.log(state);
    // Extract the final response from the agent's messages
    const finalMessage = state.messages[state.messages.length - 1] as AIMessage;

    console.log(finalMessage);

    console.log("raw content", finalMessage.content);

    const contentJSON = finalMessage.content.toString().replace(/<function=(retail_final_response|recycled_final_response),/g, "").replace("</function>", "").trim();
    console.log("split content", contentJSON);

    return new Promise((resolve, reject) => resolve(contentJSON));

    // if (finalMessage.tool_calls && finalMessage.tool_calls.length > 0 && finalMessage.tool_calls[0].name === "final_response") {
    //   const finalResponseArgs = finalMessage.tool_calls[0].args;
    //   return new Promise((resolve, reject) => resolve(finalResponseArgs)); // Return the structured arguments
    // } else {
    //   return new Promise((resolve, reject) => reject("No final_response tool call found."));
    // }
  } catch (error: any) {
    console.error("Error in runSearchWorkflow:", error);
    throw error;
  }
} 