import React, { useState,useEffect } from "react";

function Mail() {
  const [emailList, setEmailList] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const subject = localStorage.getItem('subject');
    const message = localStorage.getItem('message');
    if(subject!=null) setSubject(subject);
    if(message!=null) setMessage(message);

    const triggerBackend = async()=>{
       await fetch(`${process.env.REACT_APP_BACKEND_URL}`);
    }
    triggerBackend();
  }, [])
  
 
  const sendEmails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/send-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: emailList.split("\n"),
          subject,
          message,
        }),
      });
      const responseData = await response.json();
      if(responseData.success){
        alert("Sent Emails!")
      }
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  return (
    <div>
      <textarea
        value={emailList}
        onChange={(e) => setEmailList(e.target.value)}
        placeholder="Enter email addresses (one per line)"
        style={{ width: "100%", height: "200px" }} // Adjust width and height as needed
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => {
            setSubject(e.target.value);
            localStorage.setItem('subject',e.target.value);
        }}
        placeholder="Subject"
        style={{ width: "100%", height: "40px" }} // Adjust width and height as needed
      />
      <textarea
        value={message}
        onChange={(e) => {
            setMessage(e.target.value)
            localStorage.setItem('message',e.target.value);
        }}
        placeholder="Message"
        style={{ width: "100%", height: "300px" }} // Adjust width and height as needed
      />

      <button onClick={sendEmails}>Send Emails</button>
    </div>
  );
}

export default Mail;
