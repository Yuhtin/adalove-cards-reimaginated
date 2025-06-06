
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-ada-red rounded-full animate-spin"></div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-ada-red font-medium">Carregando autoestudos...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
