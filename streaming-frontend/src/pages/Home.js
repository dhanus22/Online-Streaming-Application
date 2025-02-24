import React from 'react';
import MediaCard from '../components/MediaCard';
import movie1 from '../assets/images/movie1.jpg'; // Import images
import movie2 from '../assets/images/movie2.jpg';

const Home = () => {
  const media = [
    { id: 1, title: 'Movie 1', description: 'A great movie', image: movie1 },
    { id: 2, title: 'Movie 2', description: 'Another great movie', image: movie2 },
  ];

  return (
    <div className="home-container">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          onPlay={() => console.log(`Playing ${item.title}`)}
        />
      ))}
    </div>
  );
};

export default Home;
