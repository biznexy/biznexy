import { listChatbots } from '@/app/actions/chatbots';
import ChatbotsTable from './chatbots-table';

export default async function ChatbotsPage() {
  const chatbots = await listChatbots();

  return (
    <div className="grow container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chatbots</h1>
      <ChatbotsTable initialChatbots={chatbots} />
    </div>
  );
}