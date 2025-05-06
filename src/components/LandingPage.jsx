const LandingPage = ({onStart}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Discover Your IKIGAI</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">Find Your Purpose And Path To A FullFilling Life</p>
            <button onClick={onStart} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg px-8 py-3 shadow-lg shadow-purple-300 transition duration-300">Start Now</button>
        </div>
    )
}

export default LandingPage;