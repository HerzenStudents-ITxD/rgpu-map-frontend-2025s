import { NewsItem } from '../types';
import { AvatarBox } from './AvatarBox';

export const NewsCard = ({ item }: { item: NewsItem }) => (
  <div className="news-card">
    <div className="news-header">
      <AvatarBox 
        imageUrl={item.group.avatar}
        name={item.group.name}
        color="#3f51b5"
      />
      <img 
        src={item.group.avatar} 
        alt={item.group.name}
        className="group-avatar"
      />
      <div>
        <h3 className="group-name">{item.group.name}</h3>
        <span className="news-date">
          {new Date(item.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>

    {/* Остальной код остаётся без изменений */}
  </div>
);