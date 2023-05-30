import { mverseToken, mverseUrl } from "./constants";

export const mversePost = async (url, data) => {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  if (mverseToken()) {
    options["headers"] = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + mverseToken(),
    };
  }
  const res = await fetch(mverseUrl + url, options);
  return res.json();
};
