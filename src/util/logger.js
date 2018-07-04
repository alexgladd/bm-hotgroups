// logging wrapper

export default (message='Message', ...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(message, ...args);
}
