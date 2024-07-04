import { useState } from "react";
import axios from "axios";
import { SlReload } from "react-icons/sl";


type Props = {
  setMessages: any;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState(false);

  const resetConversation = async () => {
    setIsResetting(true);

    await axios
      .get("http://localhost:8000/reset", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setMessages([]);
        }
      })
      .catch((err) => {});

    setIsResetting(false);
  };

  return (
    <div className="flex justify-between items-center w-full p-6 bg-customPink text-customBlue font-bold shadow text-2xl">
      <div className="flex-1 text-center">Shyraq</div>
      <button
        onClick={resetConversation}
        className={
          "transition-all duration-300" +
          (isResetting ? " animate-pulse" : "")
        }
      >
        <SlReload />
      </button>
    </div>
  );
  
}

export default Title;
