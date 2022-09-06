import s from './LoadingDots.module.css';

const LoadingDots = () => {
  return (
    <span className={`${s.root} align-middle justify-center h-full w-full`}>
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
