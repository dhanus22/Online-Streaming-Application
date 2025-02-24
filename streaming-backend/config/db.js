import chalk from 'chalk'; // Use import instead of require
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(chalk.green('MongoDB connected successfully'));
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1); // Exit the process with a failure
    }
};

export default connectDB; // Use export instead of module.exports
