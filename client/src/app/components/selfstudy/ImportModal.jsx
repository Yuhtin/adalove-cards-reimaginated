import { useState } from 'react';
import { Download, X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { sections } from '../../../lib/api';

const ImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError('');
      setResult(null);
    } else {
      setError('Por favor, selecione um arquivo JSON válido');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const fileContent = await file.text();
      const adaloveData = JSON.parse(fileContent);

      // Validate the JSON structure
      if (!adaloveData.section || !adaloveData.activities || !Array.isArray(adaloveData.activities)) {
        throw new Error('Formato de arquivo inválido. Esperado: arquivo JSON da AdaLove com "section" e array "activities"');
      }

      const response = await sections.importFromAdaLove(adaloveData);
      setResult(response);

      if (onImportSuccess) {
        onImportSuccess(response);
      }
    } catch (error) {
      console.error('Import error:', error);
      setError(error.message || 'Erro ao importar arquivo');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError('');
    setImporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative glassmorphism rounded-2xl p-8 max-w-lg w-full mx-4 border border-ada-red/20 animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-ada-red/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center mx-auto mb-6">
            {result ? <CheckCircle className="h-8 w-8 text-white" /> : <Download className="h-8 w-8 text-white" />}
          </div>

          <h2 className="text-2xl font-bold mb-4 gradient-text">
            {result ? 'Importação Concluída!' : 'Importar da AdaLove'}
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                <p className="text-green-300 font-medium">
                  {result.message}
                </p>
                <div className="mt-2 text-sm text-green-200">
                  <p>✅ {result.importedCount} atividades importadas</p>
                  {result.skippedCount > 0 && (
                    <p>⚠️ {result.skippedCount} atividades ignoradas</p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white"
              >
                Fechar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Faça upload do arquivo JSON exportado da plataforma AdaLove oficial para importar suas atividades.
              </p>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="border-2 border-dashed border-ada-red/30 rounded-2xl p-6 hover:border-ada-red/50 transition-colors">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <Upload className="h-8 w-8 text-ada-red/70" />
                    <div className="text-center">
                      <p className="font-medium text-white">
                        {file ? file.name : 'Clique para selecionar arquivo'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Apenas arquivos JSON da AdaLove
                      </p>
                    </div>
                  </label>
                </div>

                {file && (
                  <div className="bg-ada-red/10 border border-ada-red/20 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-ada-red" />
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-ada-red/20 hover:bg-ada-red/10"
                  disabled={importing}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="flex-1 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white disabled:opacity-50"
                >
                  {importing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Importando...</span>
                    </div>
                  ) : (
                    'Importar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
