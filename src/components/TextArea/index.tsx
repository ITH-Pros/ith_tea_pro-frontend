import React from "react";

const TextArea = (props: any) => {
  return (
    <div className="form-floating">
      <textarea
        className="form-control my-2"
        placeholder="Leave a comment here"
        id="floatingTextarea"
        value={props.value}
        onChange={props.onChange}
      ></textarea>
      <label htmlFor="floatingTextarea">Comments</label>
    </div>
  );
};

export default TextArea;
