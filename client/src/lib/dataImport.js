// Data import utilities for AdaLove 1.0 migration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/json', 'text/json'];
const ALLOWED_EXTENSIONS = ['.json'];

// Validate file before upload
export const validateFile = (file) => {
  const errors = [];

  // Check file existence
  if (!file) {
    errors.push('Nenhum arquivo selecionado');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    errors.push('Apenas arquivos .json são permitidos');
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push('Tipo de arquivo inválido. Apenas JSON é permitido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate JSON content structure
export const validateJsonContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        
        // Basic structure validation for AdaLove 1.0 format
        const validation = validateAdaLove1Structure(data);
        resolve(validation);
      } catch (error) {
        resolve({
          isValid: false,
          errors: ['Arquivo JSON inválido: ' + error.message]
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Erro ao ler o arquivo']
      });
    };
    
    reader.readAsText(file);
  });
};

// Validate AdaLove 1.0 data structure
const validateAdaLove1Structure = (data) => {
  const errors = [];
  
  // Check if it's an array or has expected properties
  if (!data || typeof data !== 'object') {
    errors.push('Formato de dados inválido');
    return { isValid: false, errors };
  }

  // Check for official AdaLove 1.0 export structure
  if (data.activities && Array.isArray(data.activities)) {
    // Official export format with activities array
    if (data.activities.length === 0) {
      errors.push('Nenhuma atividade encontrada no arquivo');
    } else {
      const firstActivity = data.activities[0];
      const requiredFields = ['studentActivityUuid', 'caption', 'professorName'];

      for (const field of requiredFields) {
        if (!(field in firstActivity)) {
          errors.push(`Campo obrigatório ausente: ${field}`);
        }
      }
    }
  } else if (Array.isArray(data)) {
    // Fallback: direct array of activities
    if (data.length === 0) {
      errors.push('Arquivo vazio - nenhuma atividade encontrada');
    } else {
      const firstActivity = data[0];
      const requiredFields = ['studentActivityUuid', 'caption', 'professorName'];

      for (const field of requiredFields) {
        if (!(field in firstActivity)) {
          errors.push(`Campo obrigatório ausente: ${field}`);
        }
      }
    }
  } else {
    errors.push('Estrutura não reconhecida - esperado export oficial do AdaLove 1.0');
  }

  const estimatedRecords = data.activities ? data.activities.length :
                          (Array.isArray(data) ? data.length : 0);

  return {
    isValid: errors.length === 0,
    errors,
    estimatedRecords
  };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format import status for display
export const getStatusDisplay = (status) => {
  const statusMap = {
    idle: { label: 'Aguardando', color: 'text-gray-400', icon: 'Clock' },
    uploading: { label: 'Enviando', color: 'text-blue-400', icon: 'Upload' },
    processing: { label: 'Processando', color: 'text-yellow-400', icon: 'Clock' },
    completed: { label: 'Concluído', color: 'text-green-400', icon: 'CheckCircle' },
    error: { label: 'Erro', color: 'text-red-400', icon: 'AlertCircle' },
    cancelled: { label: 'Cancelado', color: 'text-gray-400', icon: 'X' }
  };
  
  return statusMap[status] || statusMap.idle;
};

// Estimate processing time based on file size
export const estimateProcessingTime = (fileSize) => {
  // Rough estimation: 1MB = ~30 seconds processing time
  const estimatedSeconds = Math.ceil((fileSize / 1024 / 1024) * 30);
  
  if (estimatedSeconds < 60) {
    return `~${estimatedSeconds} segundos`;
  } else if (estimatedSeconds < 3600) {
    const minutes = Math.ceil(estimatedSeconds / 60);
    return `~${minutes} minutos`;
  } else {
    const hours = Math.ceil(estimatedSeconds / 3600);
    return `~${hours} horas`;
  }
};

// Poll import status with exponential backoff
export const pollImportStatus = async (jobId, onUpdate, maxAttempts = 60) => {
  let attempts = 0;
  let delay = 1000; // Start with 1 second
  
  const poll = async () => {
    try {
      const { dataImport } = await import('./api');
      const status = await dataImport.getImportStatus(jobId);
      
      onUpdate(status);
      
      // If still processing, continue polling
      if (status.status === 'processing' && attempts < maxAttempts) {
        attempts++;
        delay = Math.min(delay * 1.1, 5000); // Exponential backoff, max 5 seconds
        setTimeout(poll, delay);
      }
    } catch (error) {
      console.error('Error polling import status:', error);
      onUpdate({ status: 'error', error: error.message });
    }
  };
  
  poll();
};
