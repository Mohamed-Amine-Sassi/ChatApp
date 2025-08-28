import { useEffect, useState } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";
function App() {
  const [nbreOfUsers, setNbreOfUsers] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [resevedData, setResevedData] = useState<
    { user: string; msg: string }[]
  >([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("socket connected");
    });
    newSocket.on("numberOfConnection", (data) => {
      setNbreOfUsers(data);
    });
    newSocket.on("rseved_msg", (data) => {
      console.log(data);
      setResevedData((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  const handleMsgSending = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { user: name, msg: message };
    if (socket != null) socket.emit("message", data);
  };
  return (
    <>
      <form action="" onSubmit={handleMsgSending}>
        <input
          type="text"
          placeholder="Unknown User"
          className="user_name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {resevedData.map((m) => (
          <div className={m.user === name ? "right-msgs" : "left-msgs"}>
            <p className="msg">{m.msg}</p>
            <span className="sender_time">Monica - time</span>
          </div>
        ))}

        <input
          type="text"
          placeholder="Ur Msg..."
          className="msg_typed"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send Msg</button>
        <h3 className="number_users">Number of Users is:{nbreOfUsers}</h3>
      </form>
    </>
  );
}

export default App;
