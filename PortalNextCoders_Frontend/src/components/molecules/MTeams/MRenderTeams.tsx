import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';

interface Team {
  name: string;
  attendance: number;
  grade: number;
}

interface RenderTeamsProps {
  teams: Team[];
}

const RenderTeams: React.FC<RenderTeamsProps> = ({ teams }) => {
  const data = teams.map((team, index) => ({
    name: `Turma ${index + 1}`,
    realName: team.name, 
    Presença: team.attendance.toFixed(1),
    Notas: Number(team.grade.toFixed(1)) * 10,
  }));

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }: any) => {
    return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}%`}</text>;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Turma : ${payload[0].payload.realName}`}</p>
          <p className="intro">{`Presença : ${payload[0].value}`}</p>
          <p className="desc">{`Notas : ${payload[1].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ width: '100%', overflowX: 'scroll' }}>
      <BarChart width={180 * teams.length} height={300} data={data} barCategoryGap={15} barGap={25}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Presença" fill="#4263EB">
          <LabelList dataKey="Presença" content={renderCustomBarLabel} />
        </Bar>
        <Bar dataKey="Notas" fill="#0A4295">
          <LabelList dataKey="Notas" content={renderCustomBarLabel} />
        </Bar>
      </BarChart>
    </div>
  );
}

export default RenderTeams;