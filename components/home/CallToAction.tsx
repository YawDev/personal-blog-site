import EmailShareLink from "../blog/EmailShareLink";

interface CallToActionProps {
  postId: string;
  currentUserId: string | null;
}

const CallToAction = ({ postId, currentUserId }: CallToActionProps) => {
  return (
    <section className="bg-gray-100 py-16 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
          Share a Post You Loved
        </h2>
        <p className="text-xl text-black mb-8 leading-relaxed">
          Found something worth passing on? Send a blog post straight to a
          friend&apos;s inbox.
        </p>
        <EmailShareLink postId={postId} currentUserId={currentUserId} />
      </div>
    </section>
  );
};

export default CallToAction;
