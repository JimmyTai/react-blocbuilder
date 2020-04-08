import { Subscription, BehaviorSubject, Observable } from 'rxjs';
// 引入RxJS庫
// Subscription是用來管理資料流
// BehaviorSubject是一個廣播資料流，可以有預設數值，通常用來儲存狀態
// Observable，可以利用create創建一個流，通常可以將API包在裡面

export class DataBloc {
  // 用來管理資料流
  _disposables = new Subscription();

  // 資料儲存在這
  list = new BehaviorSubject([]);

  // 當頁面關閉會呼叫，銷毀所有的訂閱
  dispose() {
    this._disposables.unsubscribe();
  }

  getData() {
    // 模擬一支API用RxJS包裝，通常將同一類型的API寫在另一個js或ts裡
    const observable =
      Observable.create(async subscriber => {
        try {
          await new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 2000);
          });
          subscriber.next(['data_01', 'data_02']);
          subscriber.complete();
        }
        catch (e) {
          subscriber.error(e);
        }
      });
    // 呼叫API，並訂閱資料流
    const it = observable.subscribe({
      next: data => {
        // 當API成功後會傳回data，更新list這個BehaviorSubject，
        // 有訂閱這個流的會收到通知，也可以透過getValue()獲取
        // 最新的狀態
        this.list.next(data);
      },
      error: err => {
        // 當API失敗，可以做例外處理
      },
    });
    // 將這個訂閱加到disposables中，集中管理
    this._disposables.add(it);
  }
}
