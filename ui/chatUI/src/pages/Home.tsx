import { useAuth } from "../context/AuthContext";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

const Home = () => {
  const { loggedUser, streamChat } = useAuth();
  if (streamChat == null) {
    return <LoadingIndicator />;
  }
  return (
    <Chat client={streamChat}>
      <ChannelList />
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
