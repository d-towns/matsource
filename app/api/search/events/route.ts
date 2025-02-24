// pages/api/search/events.js
import redis from '@/utils/redis/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamController<Uint8Array>;
  let intervalId: NodeJS.Timeout; // Store the interval ID

  const pubsub = redis.duplicate();
  const channel = 'search-status-updates';
  await pubsub.subscribe(channel, (err, count) => {
    if (err) {
      console.error('Error subscribing to channel:', err);
    }
    console.log('Subscribed to channel:', channel, count);
  });

  const stream = new ReadableStream({
    start(c) {
      controller = c;

      pubsub.on('message', (subscribedChannel, message) => {
        if (subscribedChannel === channel) {
          console.log('Received message from Redis:', message);
          controller.enqueue(encoder.encode(`event: search-status-update\ndata: ${message}\n\n`));
        }
      });

    },
    cancel() {
      console.log("Stream cancelled by client");
      clearInterval(intervalId); // Clear the interval
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    },
  });
}