import { useLoggedAuth } from "../context/AuthContext";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelListMessengerProps,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import Button from "../shared/Button";
import { useNavigate } from "react-router-dom";
import ChatChannelButton from "../components/ChatChannelButton";
import { useCallback } from "react";
import Feedback from "../components/Feedback";

const Home = () => {
  const { loggedUser, streamChat } = useLoggedAuth();
  if (streamChat == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator color=" rgb(219 39 119)" size={40} />
      </div>
    );
  }
  return (
    <Chat client={streamChat}>
      <ChannelList
        List={Channels}
        sendChannelsToList
        filters={{ members: { $in: [loggedUser.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default Home;

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLoggedAuth();
  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);
  const channelsAvailable = !!loadedChannels && loadedChannels?.length > 0;
  return (
    <div className="w-60 h-full flex flex-col gap-4 m-3">
      <Button onClick={() => navigate("/channel/new")}>New Chat</Button>
      {channelsAvailable
        ? loadedChannels.map((channel) => (
            <ChatChannelButton channel={channel} />
          ))
        : "No Conversations"}
      <hr className="border-slate-400 mt-auto" />
      <Feedback />
      <Button onClick={handleLogout} disabled={isLoggingOut}>
        Log Out
      </Button>
    </div>
  );
}
