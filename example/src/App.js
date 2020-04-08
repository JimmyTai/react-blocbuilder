import React, { useRef, useEffect } from 'react'
import { DataBloc } from './data_bloc';
import { BlocBuilder } from 'react-blocbuilder'

const App = () => {
  const bloc = useRef(new DataBloc());

  useEffect(() => {
    const _bloc = bloc.current;
    return () => {
      _bloc.dispose();
    };
  }, []);

  return (
    <div style={{ margin: '20px 20px' }}>
      <h1>BlocBuilder Demo</h1>
      <BlocBuilder
        initialValue={bloc.current.list.getValue()}
        subject={bloc.current.list}
        builder={snapshot => {
          return (
            <p>{JSON.stringify(snapshot.data)}</p>
          );
        }}
      />
      <button onClick={() => bloc.current.getData()}>Get Data</button>
      <button onClick={() => bloc.current.list.next([])}>Clear Data</button>
    </div>
  );
}

export default App
