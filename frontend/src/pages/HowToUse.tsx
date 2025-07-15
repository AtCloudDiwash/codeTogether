import Sidebar from "../components/Sidebar";
import img1 from "../assets/method1.jpg";
import img2 from "../assets/method 2.png";

export default function HowToUse() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Sidebar />

      <div className="flex-1 flex justify-center items-start px-2 py-8 md:py-12 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-3xl font-bold text-[#2A73FF] mb-6 text-center">
            How to Use CodeTogether.net
          </h1>

          <ol className="space-y-4 text-gray-800 list-decimal list-inside mb-10">
            <li>
              <span className="font-semibold">Open the app:</span> Go to{" "}
              <code className="bg-white px-2 py-1 rounded-md text-sm font-mono">
                codetogether.net
              </code>
            </li>

            <li>
              <span className="font-semibold">Enter a Room ID:</span> You can
              either:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Type anything you want in the URL like{" "}
                  <code className="bg-white px-1">codetogether.net/myroom</code>
                </li>
                <li>
                  Or click <strong>"Share Code Now!"</strong> to generate a room
                  automatically.
                </li>
              </ul>
            </li>

            <li>
              <span className="font-semibold">Start Coding:</span> Share the
              link and collaborate in real-time.
            </li>
          </ol>

          <div className="my-8 border-t border-gray-300"></div>

          <h2 className="text-2xl font-semibold text-[#2A73FF] mb-6 text-center">
            Visual Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img
                src={img1}
                alt="Method 1 - Homepage with room input"
                className="w-full max-w-xs h-auto rounded-md border"
                style={{ maxHeight: 220, objectFit: "contain" }}
              />
              <p className="mt-3 text-center text-sm text-gray-700">
                <strong>Method 1:</strong> Homepage where you can input a room ID
                or click the CTA.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img
                src={img2}
                alt="Method 2 - Code editor interface"
                className="w-full max-w-xs h-auto rounded-md border"
                style={{ maxHeight: 220, objectFit: "contain" }}
              />
              <p className="mt-3 text-center text-sm text-gray-700">
                <strong>Method 2:</strong> Live collaborative editor where coding
                happens in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
