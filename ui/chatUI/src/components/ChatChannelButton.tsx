import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

type ChatChannelButtonProps = { channel: Channel<DefaultStreamChatGenerics> };

const ChatChannelButton = ({ channel }: ChatChannelButtonProps) => {
  const { setActiveChannel, channel: activeChannel } = useChatContext();
  const isActive = channel === activeChannel;
  const extraClasses = isActive
    ? "bg-pink-300 text-white"
    : "hover: bg-pink-200 bg-slate-200";
  return (
    <button
      onClick={() => setActiveChannel(channel)}
      disabled={isActive}
      className={`p-4 flex gap-3 items-center  ${extraClasses}`}
      key={channel.id}>
      {channel.data?.image && (
        <img
          src={channel.data.image}
          className="w-10 rounded-full object-center object-cover"
        />
      )}
      <div className="text-ellipsis overflow-hidden whitespace-nowrap">
        {channel.data?.name || channel.id}
      </div>
    </button>
  );
};

export default ChatChannelButton;
