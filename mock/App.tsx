type MockTask = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: '低' | '中' | '高';
  status: '未完了' | '完了';
  dueState: '期限切れ' | '期限が近い' | '期限あり' | '期限なし';
};

const tasks: MockTask[] = [
  {
    id: 'task-1',
    title: '週次レポートを提出する',
    description: '営業数値を反映して部内に共有する',
    dueDate: '2026-03-09',
    priority: '高',
    status: '未完了',
    dueState: '期限切れ'
  },
  {
    id: 'task-2',
    title: '歯医者を予約する',
    description: '次回検診の日程を電話で調整する',
    dueDate: '2026-03-11',
    priority: '中',
    status: '未完了',
    dueState: '期限が近い'
  },
  {
    id: 'task-3',
    title: '旅行の持ち物を確認する',
    description: 'パスポート、充電器、雨具をチェックする',
    dueDate: '2026-03-20',
    priority: '低',
    status: '完了',
    dueState: '期限あり'
  },
  {
    id: 'task-4',
    title: '本棚を整理する',
    description: '読み終えた本を分類して収納を見直す',
    dueDate: null,
    priority: '中',
    status: '未完了',
    dueState: '期限なし'
  }
];

function ScreenFrame({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="screen-card" aria-label={title}>
      <header className="screen-header">
        <div>
          <p className="eyebrow">UI モック</p>
          <h2>{title}</h2>
        </div>
        <p className="screen-description">{description}</p>
      </header>
      {children}
    </section>
  );
}

function DueStateBadge({ state }: { state: MockTask['dueState'] }) {
  return <span className={`badge badge-${state}`}>{state}</span>;
}

function TaskListMock() {
  return (
    <ScreenFrame title="1. タスク一覧画面" description="一覧、絞り込み、並び替え、期限状態、追加導線を確認するためのモックです。">
      <div className="toolbar">
        <div className="toolbar-group">
          <label>
            <span>状態</span>
            <select defaultValue="all">
              <option value="all">すべて</option>
              <option value="todo">未完了</option>
              <option value="done">完了</option>
            </select>
          </label>
          <label>
            <span>期限</span>
            <select defaultValue="all">
              <option value="all">すべて</option>
              <option value="overdue">期限切れ</option>
              <option value="dueSoon">期限が近い</option>
              <option value="upcoming">期限あり</option>
              <option value="none">期限なし</option>
            </select>
          </label>
          <label>
            <span>並び順</span>
            <select defaultValue="dueDateAsc">
              <option value="newest">作成日時が新しい順</option>
              <option value="oldest">作成日時が古い順</option>
              <option value="dueDateAsc">期限が近い順</option>
              <option value="dueDateDesc">期限が遠い順</option>
              <option value="priorityDesc">優先度が高い順</option>
            </select>
          </label>
        </div>
        <button type="button" className="primary-button">
          + タスクを追加
        </button>
      </div>

      <div className="summary-row">
        <p>4件のタスクを表示中</p>
        <p>並び順: 期限が近い順</p>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-row">
            <div className="task-main">
              <div className="task-heading">
                <h3>{task.title}</h3>
                <DueStateBadge state={task.dueState} />
              </div>
              <p className="task-description">{task.description}</p>
              <dl className="task-meta">
                <div>
                  <dt>状態</dt>
                  <dd>{task.status}</dd>
                </div>
                <div>
                  <dt>優先度</dt>
                  <dd>{task.priority}</dd>
                </div>
                <div>
                  <dt>期限</dt>
                  <dd>{task.dueDate ?? '未設定'}</dd>
                </div>
              </dl>
            </div>
            <div className="task-actions">
              <button type="button">完了にする</button>
              <button type="button">編集</button>
              <button type="button" className="danger-button">
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </ScreenFrame>
  );
}

function TaskCreateMock() {
  return (
    <ScreenFrame title="2. タスク作成画面" description="新規タスク作成時の入力項目を確認するためのモックです。">
      <form className="form-card">
        <label>
          <span>タイトル</span>
          <input type="text" placeholder="例: 会議資料を仕上げる" />
        </label>
        <label>
          <span>説明</span>
          <textarea rows={4} placeholder="補足事項や手順を入力してください" />
        </label>
        <div className="form-grid">
          <label>
            <span>期限</span>
            <input type="date" />
          </label>
          <label>
            <span>優先度</span>
            <select defaultValue="medium">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button type="button">下書き保存</button>
          <button type="submit" className="primary-button">
            タスクを作成
          </button>
        </div>
      </form>
    </ScreenFrame>
  );
}

function TaskEditMock() {
  return (
    <ScreenFrame title="3. タスク編集画面" description="既存タスクの編集項目を確認するためのモックです。">
      <form className="form-card">
        <label>
          <span>タイトル</span>
          <input type="text" defaultValue="週次レポートを提出する" />
        </label>
        <label>
          <span>説明</span>
          <textarea rows={4} defaultValue="営業数値を反映して部内に共有する" />
        </label>
        <div className="form-grid">
          <label>
            <span>期限</span>
            <input type="date" defaultValue="2026-03-09" />
          </label>
          <label>
            <span>優先度</span>
            <select defaultValue="high">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button type="button">キャンセル</button>
          <button type="submit" className="primary-button">
            保存
          </button>
        </div>
      </form>
    </ScreenFrame>
  );
}

function DeleteDialogMock() {
  return (
    <ScreenFrame title="4. 削除確認ダイアログ" description="削除確認時の表示を確認するためのモックです。">
      <div className="dialog-backdrop">
        <div className="dialog-card" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
          <h3 id="delete-title">タスクを削除しますか？</h3>
          <p>
            <strong>週次レポートを提出する</strong> を完全に削除します。この操作は元に戻せません。
          </p>
          <div className="dialog-actions">
            <button type="button">キャンセル</button>
            <button type="button" className="danger-button">
              削除する
            </button>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

export function MockApp() {
  return (
    <main className="mock-app">
      <header className="page-header">
        <p className="eyebrow">Sample Spec Kit</p>
        <h1>TODO アプリ 画面モック</h1>
        <p>
          `spec.md` と `plan.md` をもとにした UI 確認用モックです。実データ連携は行わず、画面構成と情報配置が把握できるようにしています。
        </p>
      </header>

      <div className="screen-grid">
        <TaskListMock />
        <TaskCreateMock />
        <TaskEditMock />
        <DeleteDialogMock />
      </div>
    </main>
  );
}
