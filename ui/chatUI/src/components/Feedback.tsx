import { FormEvent, useRef } from "react";
import LinkButton from "../shared/LinkButton";
import Button from "../shared/Button";
import Input from "../shared/Input";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { LoadingIndicator } from "stream-chat-react";

type FeedbackDataType = {
  feedback: string;
  title?: string;
};

const Feedback = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const openModal = () => modalRef.current?.showModal();
  const cacheKey = `${import.meta.env.VITE_SERVER_URL}/users`;
  const {
    trigger: sendFeedback,
    isMutating: isSending,
    error,
  } = useSWRMutation(
    cacheKey,
    async (url: string, { arg }: { arg: FeedbackDataType }) => {
      return await axios.post(`${cacheKey}/feedback`, arg);
    },
    {
      onSuccess: () => {
        feedbackRef.current!.value = "";
        titleRef.current!.value = "";
        closeModal();
      },
    }
  );
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    // Extract form data

    const title = titleRef.current?.value;
    const feedback = feedbackRef.current!.value;
    const data: FeedbackDataType = { feedback, title };
    //Send feedback
    await sendFeedback(data);
  };
  const closeModal = () => modalRef.current?.close();

  return (
    <div>
      <LinkButton onClick={openModal}>Send Us Feedback</LinkButton>
      <dialog
        ref={modalRef}
        className="w-[500px] p-4 rounded bg-pink-200 border-pink-500 border-solid border-[1px]">
        <form className="flex flex-col p-2">
          <label htmlFor="title"> Title: </label>
          <Input
            ref={titleRef}
            type="text"
            className="rounded p-1 "
            name="title"
            placeholder="What's the gist?"
          />
          <label htmlFor="feedback">Feedback: </label>
          <textarea
            ref={feedbackRef}
            name="feedback"
            className="rounded p-1 border focus:border-pink-600 outline-none  border-slate-400"
            placeholder="It would be great to have..."
            cols={4}
            required
          />
        </form>
        <menu className="flex justify-around">
          <Button className="!w-[10rem]" type="submit" onClick={handleSubmit}>
            {isSending ? "Submitting..." : "Submit"}
          </Button>

          <Button
            className="!w-[10rem] bg-slate-100 !text-slate-700 border-slate-400 focus:bg-slate-200 hover:bg-slate300"
            onClick={closeModal}
            disabled={isSending}
            formMethod="dialog">
            Cancel
          </Button>
        </menu>
        {error && (
          <div className="py-2 text-red-500">
            There was an error when submitting the feedback
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Feedback;
