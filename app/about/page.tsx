import { NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="text-center max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to Book Club!
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          A platform that connects readers and explorers. Manage your reading journey 
          and share your passion for literature with us!
        </p>
        <div className="bg-gray-50 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why choose our platform?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our goal is to provide an inspiring and fun way to track your reading habits. 
            Whether it's your first book or your thousandth, our community supports you every step of the way.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-left">
            <li>Discover new book recommendations tailored to your taste.</li>
            <li>Create personal reading lists and set goals.</li>
            <li>Engage with fellow book enthusiasts in real-time.</li>
            <li>Share your opinions and find inspiring reads.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;