const mongoose = require('mongoose');
const uri = 'mongodb+srv://visal8609_db_user:OV1DaGUKP8Qcmtcd@cluster0.t1ondzv.mongodb.net/truthpulse?retryWrites=true&w=majority';

async function updateDb() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to Atlas');
    const col = mongoose.connection.collection('articles');
    
    const r1 = await col.updateMany(
      { mediaUrl: { $regex: 'mixkit.co' } },
      { $set: { mediaUrl: 'https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4' } }
    );
    console.log('Updated mixkit mediaUrls in MongoDB Atlas articles:', r1.modifiedCount);

    try {
      const reelsCol = mongoose.connection.collection('reels');
      const rReels = await reelsCol.updateMany(
        { mediaUrl: { $regex: 'mixkit.co' } },
        { $set: { mediaUrl: 'https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4' } }
      );
      console.log('Updated mixkit mediaUrls in MongoDB Atlas reels:', rReels.modifiedCount);
    } catch (e) {}

    const r2 = await col.updateMany(
      { imageUrl: { $regex: 'photo-1509391365360' } },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000' } }
    );
    console.log('Updated 404 images in MongoDB Atlas:', r2.modifiedCount);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}
updateDb();
