import {
    Calendar as BigCalendar,
    momentLocalizer,
} from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);
const lang = {
    week: 'Semana',
    work_week: 'Semana de Trabalho',
    day: 'Dia',
    month: 'Mês',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    agenda: 'Agenda',
    time: 'Horário Limite',
    event: 'Evento',
    date: 'Data',
    showMore: 'Exibir mais',
};

const defaultView = {
    month: true,
    agenda: true,
    week: false,
    day: false,
    work_week: false
}
export default function Calendar(props: any) {
    return (
        <div style={{height: '80vh'}}>
            <BigCalendar {...props} views={defaultView} localizer={localizer} messages={lang}  />
        </div>
    );
}
