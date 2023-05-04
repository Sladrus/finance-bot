const { findOrCreateGroup, findGroup } = require('../http/api-group');
const { createTasks } = require('../http/api-task');

const findDaysIndex = (args) => {
  function isDays(element, index, array) {
    return /^\d+$/i.test(element);
  }
  const index = args.findIndex(isDays);
  return index;
};

async function createTask(bot, msg, args) {
  const index = findDaysIndex(args);
  console.log(index);
  if (index === 0) return;
  const taskText =
    index === -1
      ? args.slice(0, args.length).join(' ')
      : args.slice(0, index).join(' ');
  const days = index > 0 ? args.slice(index, args.length).join(' ') : undefined;
  const user_id = msg.from.id;
  const task = await createTasks(bot, msg.chat.id, {
    text: taskText,
    user_id,
    deadline_date: days,
  });
  if (!task) return;
  await bot.sendMessage(
    msg.chat.id,
    days
      ? `<b>Новая задача:</b> ${task.text}\n<b>Дней на выполнение:</b> ${task.deadline_date}`
      : `<b>Новая задача:</b> ${task.text}`,
    {
      parse_mode: 'HTML',
    }
  );
}

module.exports = async function taskCommand(bot, msg, args) {
  if (args['=ERRORS'].length) return;
  if (msg.chat.type === 'private') return;

  const group = await findGroup(bot, msg.chat.id, msg.chat.title);
  if (!group) return;
  if (args.length >= 1) await createTask(bot, msg, args);
};
