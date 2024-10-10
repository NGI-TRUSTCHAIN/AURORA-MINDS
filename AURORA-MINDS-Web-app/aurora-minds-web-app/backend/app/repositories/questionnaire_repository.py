from ..models.dtos.questionnaire_dto import QuestionnaireDto
from ..models.entities.questionnaire import Questionnaire
from ..repositories.questionnaire_repository_interface import QuestionnaireRepositoryInterface


class QuestionnaireRepository(QuestionnaireRepositoryInterface):

    @staticmethod
    def find_questionnaires_by_child_ids(child_ids: list) -> list[Questionnaire]:
        return Questionnaire.objects.filter(child_id__in=child_ids).all()

    @staticmethod
    def find_questionnaire_by_child_id(child_id: int) -> Questionnaire:
        try:
            return Questionnaire.objects.get(child_id=child_id)
        except Questionnaire.DoesNotExist:
            return None

    @staticmethod
    def create_questionnaire_rep(questionnaire_dto: QuestionnaireDto) -> Questionnaire:
        questionnaire = Questionnaire.objects.create(**questionnaire_dto.__dict__)
        return questionnaire

    @staticmethod
    def update_questionnaire_rep(questionnaire_dto: QuestionnaireDto) -> Questionnaire:
        questionnaire = Questionnaire.objects.get(pk=questionnaire_dto.questionnaire_id)
        for key, value in questionnaire_dto.__dict__.items():
            if value is not None:
                setattr(questionnaire, key, value)
        questionnaire.save()
        return questionnaire
