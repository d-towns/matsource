import { NextResponse } from 'next/server';
import redis from "@/utils/redis/client"; // Assuming you have your Redis client setup here

export const runtime = 'force-dynamic';

async function* eventGenerator() {
  const pubsub = redis.duplicate(); // Duplicate client for pub/sub
  const queue: any[] = [];

  console.log("Connected to Redis");  


  // use a generator function to yield messages
  const channel = await pubsub.subscribe('search_status_updates');
  console.log(`Subscribed to 'search_status_updates'' channel. Current subscription: ${channel}`);

  //use a queue and a while loop to yield messages

  pubsub.on('message', (channel : string, message: string) => {
    console.log(`Received message from channel: ${channel}`, message);
    queue.push(message);
  });

  try {
    while (true) {
      if (queue.length > 0) {
        const data = queue.shift();
        yield { event: 'search-status-update', data };
      } else {
        // Wait briefly before checking again.
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  } catch (err) {
    console.error("Subscription failed:", err);
    yield { event: 'error', data: 'Subscription failed' };
    return;
  } finally {
    await pubsub.unsubscribe('search_status_updates');
    await pubsub.quit();
  }
}

export async function GET() {
  const encoder = new TextEncoder();
  console.log("Getting SSE stream");
  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of eventGenerator()) {
        console.log(event);
        const message = `event: ${event.event}\ndata: ${event.data}\n\n`;
        controller.enqueue(encoder.encode(message));
      }
      controller.close();
    }
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