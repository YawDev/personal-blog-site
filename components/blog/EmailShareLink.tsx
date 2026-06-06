import { useState } from "react";
import SentEmailCheckmark from "./SentEmailCheckmark";
import { shareLinkEmailApi } from "@/service/PersonalBlogService";
import { EmailShareLinkRequest, EmailShareLinkResponse } from "@/types/types";

const handleEmailShareLink = async (
  postId: string,
  recipientEmail: string,
  currentUserId: string | null,
  shareLink: string,
): Promise<EmailShareLinkResponse> => {
  const req: EmailShareLinkRequest = {
    postId: postId,
    recipientEmail: recipientEmail,
    identityUserId: currentUserId,
    blogShareLink: shareLink,
  };

  return await shareLinkEmailApi(req);
};

const validateEmailInput = (input: string): [string, boolean] => {
  var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(input)) return ["Enter a valid email address", false];

  return ["", true];
};

interface EmailShareLinkProps {
  postId: string;
  currentUserId: string | null;
}

const EmailShareLink = ({ postId, currentUserId }: EmailShareLinkProps) => {
  const [emailInput, setEmailInput] = useState<{
    input: string;
    isValid: boolean;
  }>({ input: "", isValid: false });

  const [error, setError] = useState<string>("");
  const [sendError, setSendError] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showEmailSentCheck, setShowEmailSentCheck] = useState<boolean>(false);
  const [checkVisible, setCheckVisible] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="email"
          placeholder="Enter your email address"
          className="px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-teal-300 outline-none min-w-80"
          value={emailInput.input}
          onChange={(e) => {
            const val = e.target.value;
            const [errorMessage, isValid] = validateEmailInput(val);

            setEmailInput({ input: val, isValid: isValid });
            setError(errorMessage);
            setSendError("");
          }}
        />

        {showEmailSentCheck ? (
          <div
            className={`flex justify-center items-center px-8 py-4 transition-opacity duration-500 ${
              checkVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <SentEmailCheckmark />
          </div>
        ) : (
          <button
            className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-gray-200"
            disabled={!emailInput.isValid || isSending}
            onClick={async () => {
              const currentPageURL = window.location.href;
              setSendError("");
              setIsSending(true);

              const result = await handleEmailShareLink(
                postId,
                emailInput.input,
                currentUserId,
                currentPageURL,
              );

              setIsSending(false);
              setEmailInput({ input: "", isValid: false });
              if (result.status !== 200) {
                setSendError(result.message);
                return;
              }

              setShowEmailSentCheck(true);
              setCheckVisible(true);
              setTimeout(() => setCheckVisible(false), 2000);
              setTimeout(() => setShowEmailSentCheck(false), 2500);
            }}
          >
            {isSending ? "Sending..." : "Send Email"}
          </button>
        )}
      </div>
      {!emailInput.isValid && emailInput.input && (
        <span className="text-red-500 text-sm px-2">{error}</span>
      )}
      {sendError && (
        <span className="text-red-500 text-sm px-2">{sendError}</span>
      )}
    </>
  );
};

export default EmailShareLink;
