import { useState, useEffect } from 'react';
import { Subscription, Subject } from 'rxjs';

type BlocBuilderProps<T> = {
  initialValue: T;
  subject: Subject<T>;
  builder: (snapshot: {
    data: T;
    connectionState: number;
    error?: any;
  }) => JSX.Element;
};

type BlocBuilderState<T> = {
  snapshot: { data: T, connectionState: number, error?: any };
}

export const BlocBuilder = <T,>(props: BlocBuilderProps<T>) => {
  const [state, setState] = useState<BlocBuilderState<T>>({
    snapshot: {
      data: props.initialValue,
      connectionState: -1,
      error: undefined,
    },
  });

  useEffect(() => {
    const _disposables = new Subscription();
    const it = props.subject.subscribe({
      next: (data: T) => {
        setState({
          snapshot: {
            data: data,
            connectionState: 0,
            error: undefined,
          },
        });
      },
      error: (err: any) => {
        setState({
          snapshot: {
            data: props.initialValue,
            connectionState: 1,
            error: err,
          },
        });
      },
      complete: () => {
        setState({
          snapshot: {
            data: props.initialValue,
            connectionState: 1,
            error: undefined,
          },
        });
      },
    });
    _disposables.add(it);
    return () => {
      _disposables.unsubscribe();
    };
  }, [props]);

  return props.builder(state.snapshot);
};
