# react-blocbuilder

> BlocBuilder is a component which is like Flutter StreamBuilder. This component can help you to use BLoC pattern in react.

[![NPM](https://img.shields.io/npm/v/react-blocbuilder.svg)](https://www.npmjs.com/package/react-blocbuilder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Tutorial
You can find a Chinese tutorial in the [Medium article](https://medium.com/@jimmytai0315/%E5%9C%A8react%E4%B8%AD%E6%90%AD%E9%85%8Dhook%E4%BD%BF%E7%94%A8bloc-pattern-20c7f1ce7063).

## Live Demo
https://jimmytai.github.io/react-blocbuilder/

## Install

```bash
npm install react-blocbuilder

or

yarn add react-blocbuilder
```

## Usage

 - BLoC Class

```ts
  import { Subscription, BehaviorSubject, Observable } from  'rxjs';
  // 引入RxJS庫
  // Subscription是用來管理資料流
  // BehaviorSubject是一個廣播資料流，可以有預設數值，通常用來儲存狀態
  // Observable，可以利用create創建一個流，通常可以將API包在裡面

  export class DataBloc {
	// 用來管理資料流
	_disposables = new  Subscription();

	// 資料儲存在這
	list = new  BehaviorSubject([]);

	// 當頁面關閉會呼叫，銷毀所有的訂閱
	dispose() {
	  this._disposables.unsubscribe();
	}

	getData() {
	  // 模擬一支API用RxJS包裝，通常將同一類型的API寫在另一個js或ts裡
	  const  observable =
		Observable.create(async  subscriber  => {
		  try {
			await  new  Promise((resolve, reject) => {
			  setTimeout(() =>  resolve(), 2000);
			});
			subscriber.next(['data_01', 'data_02']);
			subscriber.complete();
		  }
		  catch (e) {
			subscriber.error(e);
		  }
		});

	  // 呼叫API，並訂閱資料流
	  const  it = observable.subscribe({
		next:  data  => {
		  // 當API成功後會傳回data，更新list這個BehaviorSubject，
		  // 有訂閱這個流的會收到通知，也可以透過getValue()獲取
		  // 最新的狀態
		  this.list.next(data);
		},
		error:  err  => {
		  // 當API失敗，可以做例外處理
		},
	  });
	  // 將這個訂閱加到disposables中，集中管理
	  this._disposables.add(it);
    }
  }
```

- React Component

```ts

  import  React, { useRef, useEffect } from  'react'
  import { DataBloc } from  './data_bloc';
  import { BlocBuilder } from  'react-blocbuilder'

  const  App = () => {
	const  bloc = useRef(new  DataBloc());

	useEffect(() => {
	  const  _bloc = bloc.current;
	  return () => {
		_bloc.dispose();
	  };
	}, []);

	return (
	  <div  style={{ margin:  '20px 20px' }}>
		<h1>BlocBuilder Demo</h1>
		<BlocBuilder
		  // 
		  initialValue={bloc.current.list.getValue()}
		  subject={bloc.current.list}
		  builder={snapshot  => {
			return (
			  <p>{JSON.stringify(snapshot.data)}</p>
			);
		  }}
		/>
		<button  onClick={() => bloc.current.getData()}>Get Data</button>
		<button  onClick={() =>  bloc.current.list.next([])}>Clear Data</button>
	  </div>
	);
  }
  
  export  default  App

```

  

## License

MIT License

Copyright (c) 2020  [JimmyTai](https://github.com/JimmyTai).

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.