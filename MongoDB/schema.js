const mongoose = require('mongoose');

let User;

const UserSchema = new mongoose.Schema({
username: { type: String, required: true },
password: { type: String, required: true },
access: { type: Boolean, required: true },
number: { type: Array, required: true },
});

UserSchema.statics.deleteUser = async function(username) {
try {
await this.findOneAndRemove({ username });
console.log(chalk.green(`User ${username} deleted successfully!`));
} catch (err) {
console.error(chalk.red(`Error deleting user: ${err}`));
}
};

UserSchema.statics.editUser = async function(username, updates) {
try {
const user = await this.findOne({ username });
if (!user) {
console.log(chalk.red(`User ${username} not found!`));
return;
}
Object.assign(user, updates);
await user.save();
console.log(chalk.green(`User ${username} updated successfully!`));
} catch (err) {
console.error(chalk.red(`Error updating user: ${err}`));
}
};

function createModel() {
User = mongoose.model('user', UserSchema);
return User;
}

module.exports.User = createModel();