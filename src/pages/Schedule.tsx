import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ScheduleItem {
  time: string;
  event: string;
  location: string;
}

const scheduleData: Record<string, ScheduleItem[]> = {
  '27 февраля': [
    { time: '9:40', event: 'Математика', location: 'Аудитория 366' },
    { time: '11:20', event: 'Основы Компьютерной Графики', location: 'Аудитория 366' },
    { time: '13:00', event: 'Основы Компьютерной Графики', location: 'Аудитория 366' },
    { time: '15:10', event: 'Физика', location: 'Аудитория 366' },
  ],
  '28 февраля': [
    { time: '9:40', event: 'Математика', location: 'Аудитория 366' },
    { time: '11:20', event: 'Основы Компьютерной Графики', location: 'Аудитория 366' },
    { time: '13:00', event: 'Основы Компьютерной Графики', location: 'Аудитория 366' },
    { time: '15:10', event: 'Физика', location: 'Аудитория 366' },
  ],
  '29 февраля': [],
};

const Schedule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('schedule.title')}
      </Typography>
      {Object.entries(scheduleData).map(([date, events]) => (
        <Box key={date} sx={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {date}
          </Typography>
          {events.length > 0 ? (
            <List>
              {events.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${event.time} - ${event.event}`}
                    secondary={event.location}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('schedule.noEvents')}
            </Typography>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default Schedule;