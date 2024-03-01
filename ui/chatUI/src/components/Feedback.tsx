import { useRef } from "react";
import LinkButton from "../shared/LinkButton";
import Button from "../shared/Button";
import Input from "../shared/Input";

const Feedback = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const openModal = () => modalRef.current?.showModal();
  const handleSubmit = () => {};
  const closeModal = () => modalRef.current?.close();

  return (
    <div>
      <LinkButton onClick={openModal}>Send Us Feedback</LinkButton>
      <dialog
        ref={modalRef}
        className="w-[500px] p-4 rounded bg-pink-200 border-pink-500 border-solid border-[1px]">
        <form onSubmit={handleSubmit} className="flex flex-col p-2">
          <label htmlFor="title"> Title: </label>
          <Input
            type="text"
            className="rounded p-1 "
            name="title"
            placeholder="What's the gist?"
          />
          <label htmlFor="feedback">Feedback: </label>
          <textarea
            name="feedback"
            className="rounded p-1 border focus:border-pink-600 outline-none  border-slate-400"
            placeholder="It would be great to have..."
            cols={4}
            required
          />
        </form>
        <menu className="flex justify-around">
          <Button className="w-[10rem]" type="submit">
            Submit
          </Button>
          <Button
            className="w-[10rem] bg-slate-100 text-slate-700 border-slate-400 focus:bg-slate-200 hover:bg-slate300"
            onClick={closeModal}>
            Cancel
          </Button>
        </menu>
      </dialog>
    </div>
  );
};

export default Feedback;
