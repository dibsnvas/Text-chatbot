import { useState } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  function createBlobURL(data: any) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);
  
    const myMessage = { sender: "me", blobUrl };
    const messagesArr = [...messages, myMessage];
  
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");
  
        try {
          const res = await axios.post("http://localhost:8000/post-audio/", formData, {
            responseType: "arraybuffer",
          });
  
          const audioBlob = res.data;
          const audio = new Audio();
          audio.src = createBlobURL(audioBlob);
  
          const almaMessage = { sender: "alma", blobUrl: audio.src };
          messagesArr.push(almaMessage);
          setMessages(messagesArr);
  
          setIsLoading(false);
          audio.play();
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      });
  };
  


  return (
    <div className="h-screen overflow-y-hidden bg-white">
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        <div className="mt-5 px-5">
          {messages?.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " +
                  (audio.sender == "alma" && "flex items-end")
                }
              >
                <div className="mt-4 ">
                  <p
                    className={
                      audio.sender == "alma"
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 russian text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>

                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}

          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light mt-10">
              Запиши сообщение...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Дай мне подумать...
            </div>
          )}
        </div>

        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r bg-customBlue">
          <div className="flex justify-center items-center w-full">
            <div>
              <RecordMessage handleStop={handleStop} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
