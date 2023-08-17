import React, { useState } from "react";
import TextEditor from "./textEditor";

const CommentBox = ({ onSubmit }) => {
  const [comment, setComment] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment, attachment);
    setComment("");
    setAttachment(null);
  };

  const handleCommentChange = (e) => {
    const text = e.target.value.slice(0, 250);
    setComment(text);
  };

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Comment:
        <TextEditor
          height={100}
          width="100%"
          placeholder="Enter text here"
          value={comment}
          onChange={handleCommentChange}
        />
      </label>
      <label>
        Attachment:
        <input type="file" onChange={handleAttachmentChange} />
      </label>
    </form>
  );
};

export default CommentBox;
