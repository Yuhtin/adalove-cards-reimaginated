import { Download, FileText, Upload, ArrowRight, BookOpen, Calendar } from 'lucide-react';

const EmptyWeekSelector = ({ onImportClick }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Hero Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-ada-red/20 to-ada-accent/20 rounded-3xl flex items-center justify-center border border-ada-red/20">
            <BookOpen className="h-16 w-16 text-ada-red" />
          </div>          
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Aqui ficarão seus autoestudos simplificados!
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Para começar, você precisa importar seus dados do AdaLove oficial. 
            Isso criará suas semanas de estudo e atividades personalizadas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="glassmorphism rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">1. Exporte do AdaLove</h3>
            <p className="text-sm text-slate-400">
              Acesse o AdaLove oficial e exporte seus dados em formato JSON
            </p>
          </div>

          <div className="glassmorphism rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-ada-red to-ada-accent rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">2. Importe Aqui</h3>
            <p className="text-sm text-slate-400">
              Use o botão abaixo para fazer upload do arquivo JSON exportado
            </p>
          </div>

          <div className="glassmorphism rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">3. Estude!</h3>
            <p className="text-sm text-slate-400">
              Suas semanas e atividades aparecerão organizadas e prontas para uso
            </p>
          </div>
        </div>

        {/* Import Button */}
        <div className="space-y-4">
          <button
            onClick={onImportClick}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-ada-red/25 hover:shadow-2xl hover:shadow-ada-red/40 transform hover:scale-105 mx-auto"
          >
            <Download className="h-5 w-5" />
            <span>Importar Dados do AdaLove</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-slate-400">
            Arquivo JSON • Máximo 10MB • Dados seguros e privados
          </p>
        </div>

        {/* Additional Info */}
        <div className="glassmorphism rounded-2xl p-6 border border-white/10 bg-blue-500/5">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-white mb-2">Como exportar do AdaLove?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                No AdaLove oficial, vá em <strong className="text-white">Configurações → Exportar Dados</strong> e 
                baixe o arquivo JSON com suas atividades de autoestudo. Este arquivo contém todas as 
                informações necessárias para organizar seus estudos por semana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyWeekSelector;
