"use client";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  const handleNextPage = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="text-[#4285f4] text-2xl font-bold">G</div>
            <div className="text-[#ea4335] text-2xl font-bold">o</div>
            <div className="text-[#fbbc05] text-2xl font-bold">o</div>
            <div className="text-[#4285f4] text-2xl font-bold">g</div>
            <div className="text-[#34a853] text-2xl font-bold">l</div>
            <div className="text-[#ea4335] text-2xl font-bold">e</div>
          </div>
          
          <div className="ml-8 flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                defaultValue="xylem +2 note"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Result Stats */}
        <div className="text-sm text-gray-600 mb-6">
          About 1,240,000 results (0.42 seconds)
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {/* Result 1 */}
          <div className="border-b border-gray-200 pb-4">
            <div className="text-sm text-gray-500 mb-1">
              https://www.studyadda.com › xylem-notes
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
              Xylem Notes for Class 12 Biology - StudyAdda
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Comprehensive notes on xylem tissue structure, function, and importance in plant biology. 
              Perfect for Class 12 students preparing for board exams and competitive tests.
            </p>
          </div>

          {/* Result 2 */}
          <div className="border-b border-gray-200 pb-4">
            <div className="text-sm text-gray-500 mb-1">
              https://www.biologynotes.com › xylem-class12
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
              Xylem Tissue: Complete Guide for Class 12 - Biology Notes
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Detailed explanation of xylem vessels, tracheids, and their role in water transport. 
              Includes diagrams, MCQs, and previous year questions for better understanding.
            </p>
          </div>

          {/* Result 3 */}
          <div className="border-b border-gray-200 pb-4">
            <div className="text-sm text-gray-500 mb-1">
              https://www.educationportal.com › xylem-notes-pdf
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
              Download Xylem Notes PDF for Class 12 - Free Study Material
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Free downloadable PDF notes covering xylem anatomy, physiology, and adaptations. 
              Ideal for revision and last-minute preparation before exams.
            </p>
          </div>

          {/* Result 4 */}
          <div className="border-b border-gray-200 pb-4">
            <div className="text-sm text-gray-500 mb-1">
              https://www.sciencenotes.org › xylem-structure
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
              Xylem Structure and Function - Science Notes
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Scientific explanation of xylem development, secondary growth, and evolutionary significance. 
              Advanced concepts for students interested in plant biology research.
            </p>
          </div>

          {/* Result 5 */}
          <div className="border-b border-gray-200 pb-4">
            <div className="text-sm text-gray-500 mb-1">
              https://www.botanyguide.com › xylem-class12-notes
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-2">
              Botany Guide: Xylem Notes for Class 12 Students
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Comprehensive botany notes focusing on xylem tissue types, cell wall composition, 
              and transport mechanisms. Includes practical experiments and lab procedures.
            </p>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="text-blue-800 font-medium">1</div>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded"
          >
            2
          </button>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded"
          >
            3
          </button>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded"
          >
            4
          </button>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded"
          >
            5
          </button>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded"
          >
            Next
          </button>
        </div>

        {/* Related Searches */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Related searches</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-blue-800 hover:underline cursor-pointer">xylem tissue diagram</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem function in plants</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem vs phloem notes</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem class 12 biology</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem structure pdf</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem transport mechanism</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem cell types</div>
            <div className="text-blue-800 hover:underline cursor-pointer">xylem adaptation notes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
