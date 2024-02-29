import React, { FormEvent, useRef } from "react";
import Card from "../../components/Card";
import Link from "../../shared/Link";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import useSWRMutation from "swr/mutation";
import Select, { SelectInstance } from "react-select";
import useSWR from "swr";
import { useLoggedAuth } from "../../context/AuthContext";

type newChanelMutationProps = {
  name: string;
  memberIds: string[];
  imageUrl?: string;
};

const NewChannel = () => {
  const { streamChat, loggedUser } = useLoggedAuth();
  const { trigger: createChannel, isMutating: isCreating } = useSWRMutation(
    "newChannel",
    async (url: string, { arg }: { arg: newChanelMutationProps }) => {
      if (!streamChat) throw new Error("Not connected");
      const { name, memberIds, imageUrl } = arg;
      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [loggedUser.id, ...memberIds],
        })
        .create();
    }
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const membersRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null);
  const {
    isLoading,
    error,
    data: users,
  } = useSWR(
    "stream users",
    () => streamChat!.queryUsers({ id: { $ne: loggedUser.id } }, { name: 1 }),
    {
      isPaused: () => streamChat != null,
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const imageUrl = imageRef.current?.value;
    const selectOptions = membersRef.current?.getValue();
    if (!name || !selectOptions || selectOptions.length === 0) {
      return;
    }
    createChannel({
      name,
      imageUrl,
      memberIds: selectOptions!.map((so) => so.value),
    });
  };
  const memberSelection = error ? (
    <div className="text-red-700">Could not load users</div>
  ) : (
    <Select
      ref={membersRef}
      id="members"
      required
      isMulti
      classNames={{ container: () => "w-full" }}
      isLoading={isLoading}
      options={users!.users!.map((u) => ({
        value: u.id,
        label: u.name || u.id,
      }))}
    />
  );
  return (
    <Card>
      <Card.Body>
        <h1 className="text-2xl text-pink-600 font-bold mb-7 text-center">
          New Chat
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid gap-y-5 gap-x-4 grid-cols-[auto,1fr] justify-items-en items-center">
          <label htmlFor="name">Name</label>
          <Input name="username" required ref={nameRef} />
          <label htmlFor="image">Image URL</label>
          <Input name="image" ref={imageRef} />
          <label htmlFor="members">Members</label>
          {memberSelection}
          <Button type="submit" className="col-span-full" disabled={isCreating}>
            {isCreating ? "Logging..." : "Sign In"}
          </Button>
        </form>
      </Card.Body>
      <Card.CardFooter>
        <Link to="/">Back</Link>
      </Card.CardFooter>
    </Card>
  );
};

export default NewChannel;
