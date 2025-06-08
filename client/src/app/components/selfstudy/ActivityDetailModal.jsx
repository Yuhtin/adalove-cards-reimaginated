import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  User,
  Calendar,
  Star,
  Link,
  BookOpen,
  Tag,
  ExternalLink,
  FileText,
  MessageSquare,
  Award,
  Weight,
  X
} from 'lucide-react';

const ActivityDetailModal = ({ activity, isOpen, onClose }) => {
  if (!activity) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Feito':
        return {
          color: 'bg-green-500',
          badge: 'bg-green-500/10 text-green-600 border-green-500/20',
          label: 'Feito'
        };
      case 'Fazendo':
        return {
          color: 'bg-yellow-500',
          badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          label: 'Fazendo'
        };
      case 'A fazer':
        return {
          color: 'bg-slate-500',
          badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          label: 'A Fazer'
        };
      default:
        return {
          color: 'bg-slate-500',
          badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          label: 'A Fazer'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log(activity);
  const statusConfig = getStatusConfig(activity.status);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 glassmorphism backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Detalhes da Atividade</h2>
          <Button
            onClick={onClose}
            className="p-2 bg-white/05 border-white/10 hover:bg-white/10 hover:border-white/20 border backdrop-blur-sm rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-8">
            {/* Activity Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                    {activity.name}
                  </h3>
                  <div className="flex items-center space-x-3 flex-wrap gap-2">
                    <Badge className={`${statusConfig.badge} border font-medium px-3 py-1`}>
                      {statusConfig.label}
                    </Badge>
                    {activity.isRequired && (
                      <Badge className="bg-ada-red/20 text-ada-red border-ada-red/30 border font-medium px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Obrigatória
                      </Badge>
                    )}
                    <Badge className="bg-white/10 text-white border-white/20 border font-medium px-3 py-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {activity.type}
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-ada-red to-ada-accent rounded-2xl flex items-center justify-center ml-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-ada-red" />
                    Informações Básicas
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-ada-red flex-shrink-0" />
                        <div>
                          <p className="text-sm text-white/60">Professor</p>
                          <p className="font-medium text-white">{activity.professor || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-ada-red flex-shrink-0" />
                        <div>
                          <p className="text-sm text-white/60">Data e Horário</p>
                          <p className="font-medium text-white">
                            {formatDate(activity.date)} - {formatTime(activity.date) || '10:00h'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 text-ada-red flex-shrink-0" />
                        <div>
                          <p className="text-sm text-white/60">Semana</p>
                          <p className="font-medium text-white">Semana {activity.week || '01'}</p>
                        </div>
                      </div>
                    </div>

                    {activity.url && (
                      <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Link className="h-4 w-4 text-ada-red flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-white/60">URL da Atividade</p>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-medium text-ada-red hover:text-ada-accent transition-colors"
                              onClick={() => window.open(activity.url, '_blank')}
                            >
                              <span className="truncate max-w-[200px]">Acessar Atividade</span>
                              <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                {/* Description */}
                {activity.description && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-ada-red" />
                      Descrição
                    </h4>
                    <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                      <div
                        className="text-white/80 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: activity.description }}
                      />
                    </div>
                  </div>
                )}

                {/* Study Information */}
                {(activity.activityNotes || activity.studyQuestion || activity.studyAnswer || activity.activityRating) && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-ada-red" />
                      Informações de Estudo
                    </h4>
                    <div className="space-y-4">
                      {activity.activityNotes && (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <FileText className="h-4 w-4 text-ada-red flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-white/60">Anotações</p>
                              <p className="text-white/80 text-sm mt-1">{activity.activityNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activity.activityRating > 0 && (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <Award className="h-4 w-4 text-ada-red flex-shrink-0" />
                            <div>
                              <p className="text-sm text-white/60">Avaliação</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= activity.activityRating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-white/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-white/80 text-sm">
                                  {activity.activityRating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activity.weightValue > 0 && (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <Weight className="h-4 w-4 text-ada-red flex-shrink-0" />
                            <div>
                              <p className="text-sm text-white/60">Peso</p>
                              <p className="font-medium text-white">{activity.weightValue}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activity.studyQuestion && (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-white/60 mb-2">Pergunta de Estudo</p>
                              <p className="text-white/80 text-sm">{activity.studyQuestion}</p>
                            </div>
                            {activity.studyAnswer && (
                              <div className="border-t border-white/10 pt-3">
                                <p className="text-sm text-white/60 mb-2">Resposta</p>
                                <p className="text-white/80 text-sm">{activity.studyAnswer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;