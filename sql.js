/* =========================================================================
   sql.js — SQL (PostgreSQL) topics.
   Loaded by <script src="sql.js"> in index.html (after app.js).
   Library id: "sql"  (must match the folder value in LIBRARY_META in app.js).

   Every SQL example below was executed on a real PostgreSQL engine and the
   printed output (psql style) was captured, so what students see on screen
   is exactly what pgAdmin / psql will show them. Values that change from
   machine to machine (dates, timings, costs) are marked in the topic text.

   Sample databases used through the course (setup scripts are shown inside
   the topics that need them):
     - employees / departments        (Modules 2 - 7)
     - customers / products / orders  (Modules 4 - 9, projects)

   Images live in attachments/ (same folder as the Pandas images).
   File names start with "sql_" – see SQL_IMAGE_PROMPTS.md for what to draw.
   ========================================================================= */
(function () {
  /* ---- layout helpers (same markup as pandas.js, so style.css just works) -- */
  const section = (num, title, body) => `
    <section class="intro-section">
      <div class="intro-section-head">
        ${num ? `<span class="intro-section-num">${num}</span>` : ""}
        <h3 class="intro-section-title">${title}</h3>
      </div>
      ${body}
    </section>`;

  const p = (text) => `<p class="intro-section-body">${text}</p>`;

  const chips = (items) => `
    <div class="intro-chip-grid">
      ${items.map(([icon, text]) => `<span class="intro-chip"><i class="${icon}"></i>${text}</span>`).join("")}
    </div>`;

  const callout = (icon, html) => `
    <div class="intro-callout">
      <i class="${icon}"></i>
      <div class="intro-callout-body">${html}</div>
    </div>`;

  const table = (heads, rows) => `
    <div class="intro-table-wrap">
      <table class="intro-table is-wrap">
        <thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;

  const bullets = (items) => `<ul class="intro-bullets">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;

  const numlist = (cls, items) => `
    <ol class="intro-numlist ${cls}">
      ${items.map(([title, text]) => `<li><strong>${title}</strong> – ${text}</li>`).join("")}
    </ol>`;

  const sub = (num, title) => `<h4 class="intro-subhead">${num} ${title}</h4>`;

  const split = (t1, l1, t2, l2) => `
    <div class="intro-split">
      <div class="intro-split-col"><h4>${t1}</h4>${bullets(l1)}</div>
      <div class="intro-split-col"><h4>${t2}</h4>${bullets(l2)}</div>
    </div>`;

  const hero = (icon, title, tag) => `
    <div class="intro-hero">
      <span class="intro-hero-badge"><i class="${icon}"></i></span>
      <div>
        <h2 class="intro-hero-title">${title}</h2>
        <p class="intro-hero-tag">${tag}</p>
      </div>
    </div>`;

  /* small shortcuts */
  const c = (text) => `<code>${escapeHtml(text)}</code>`;                       // inline code (auto-escaped)
  const tip = (html) => callout("fa-solid fa-lightbulb", `<p><strong>Tip:</strong> ${html}</p>`);
  const warn = (html) => callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> ${html}</p>`);
  const note = (label, html) => callout("fa-solid fa-circle-info", `<p><strong>${label}</strong> ${html}</p>`);
  const real = (html) => callout("fa-solid fa-briefcase", `<p><strong>Real-world use:</strong> ${html}</p>`);

  /* ---- code blocks (copy button is handled by app.js via data-copy-code) ---- */
  const codeBlock = (label, code, icon) => `
    <div class="intro-code">
      <div class="intro-code-header">
        <span class="intro-code-label"><i class="${icon || "fa-solid fa-database"}"></i> ${label}</span>
        <button class="copy-btn" type="button" data-copy-code><i class="fa-regular fa-copy"></i><span>Copy code</span></button>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </div>`;

  const outBlock = (text) => codeBlock("Output", text, "fa-solid fa-terminal");
  const sh = (label, code) => codeBlock(label, code, "fa-solid fa-terminal");     // psql / shell commands

  // SQL example helpers. The build step captured the real output for every
  // ex() key into OUT (below).
  //   ex(key, sql[, label])    SQL + its real output
  //   exq(key, sql[, label])   SQL only (it was still run, e.g. to build up state)
  //   exn(key, sql[, label])   SQL only, not run (syntax templates, pgAdmin / psql only)
  //   exo(key, sql, output)    SQL + a fixed output text (values that differ per machine)
  //   setup(sql)               run silently, nothing is shown
  const ex = (key, sql, label) => codeBlock(label || "SQL", sql) + (OUT[key] ? outBlock(OUT[key]) : "");
  const exq = (key, sql, label) => codeBlock(label || "SQL", sql);
  const exn = (key, sql, label) => codeBlock(label || "SQL", sql);
  const exo = (key, sql, output, label) => codeBlock(label || "SQL", sql) + outBlock(output);
  const setup = () => "";

  /* ---- image slot: picture if attachments/<file> exists, else a placeholder -- */
  const IMAGE_DIR = "attachments/";
  const fig = (file, alt) => `
    <figure class="intro-figure" data-scale="1">
      <div class="intro-figure-stage">
        <img src="${IMAGE_DIR + file}" alt="${alt}" onerror="this.closest('.intro-figure').classList.add('is-missing')">
      </div>
      <div class="intro-figure-tools" role="group" aria-label="Image controls">
        <button class="img-tool-btn" type="button" data-img-action="full" title="View full screen" aria-label="View image full screen"><i class="fa-solid fa-expand"></i></button>
        <button class="img-tool-btn" type="button" data-img-action="in" title="Zoom in image" aria-label="Zoom in image"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
        <button class="img-tool-btn" type="button" data-img-action="out" title="Zoom out image" aria-label="Zoom out image" disabled><i class="fa-solid fa-magnifying-glass-minus"></i></button>
      </div>
      <div class="intro-figure-missing"><i class="fa-regular fa-image"></i><span>Add image: <code>${IMAGE_DIR + file}</code></span></div>
    </figure>`;

  /* ---- topic registration ------------------------------------------------- */
  const topic = (id, title, level, summary, icon, heading, tag, body) => registerTopic({
    library: "sql",
    id: id,
    title: title,
    difficulty: level,
    summary: summary,
    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = hero(icon, heading, tag) + body();
    },
  });

  /* ---- shared sample data (the same scripts the examples were run on) ------ */
  const SETUP_EMP = "CREATE TABLE departments (\n    dept_id    INTEGER PRIMARY KEY,\n    dept_name  VARCHAR(30) NOT NULL,\n    location   VARCHAR(30)\n);\n\nCREATE TABLE employees (\n    emp_id      INTEGER PRIMARY KEY,\n    emp_name    VARCHAR(40) NOT NULL,\n    dept_id     INTEGER REFERENCES departments (dept_id),\n    salary      NUMERIC(10,2),\n    hire_date   DATE,\n    manager_id  INTEGER,\n    city        VARCHAR(30),\n    commission  NUMERIC(8,2)\n);\n\nINSERT INTO departments VALUES\n    (10, 'Sales',   'Hyderabad'),\n    (20, 'HR',      'Mumbai'),\n    (30, 'IT',      'Bengaluru'),\n    (40, 'Finance', 'Chennai');\n\nINSERT INTO employees VALUES\n    (101, 'Ali Khan',       10, 55000, '2020-03-15', NULL, 'Hyderabad', 5000),\n    (102, 'Ayesha Rao',     10, 62000, '2019-07-01', 101,  'Hyderabad', 7000),\n    (103, 'Ravi Kumar',     30, 75000, '2018-01-20', 101,  'Bengaluru', NULL),\n    (104, 'John Mathew',    30, 68000, '2021-09-10', 103,  'Bengaluru', NULL),\n    (105, 'Priya Sharma',   20, 48000, '2022-02-14', 101,  'Mumbai',    NULL),\n    (106, 'Meena Iyer',     30, 82000, '2017-11-05', 103,  'Chennai',   NULL),\n    (107, 'Karan Mehta',    10, 45000, '2023-06-01', 102,  'Hyderabad', 2000),\n    (108, 'Sara Fernandes', NULL, 52000, '2023-01-10', 105, 'Mumbai',   NULL);";
  const SETUP_SHOP = "CREATE TABLE customers (\n    customer_id    INTEGER PRIMARY KEY,\n    customer_name  VARCHAR(40) NOT NULL,\n    city           VARCHAR(30),\n    signup_date    DATE\n);\n\nCREATE TABLE products (\n    product_id    INTEGER PRIMARY KEY,\n    product_name  VARCHAR(40) NOT NULL,\n    category      VARCHAR(30),\n    price         NUMERIC(10,2)\n);\n\nCREATE TABLE orders (\n    order_id     INTEGER PRIMARY KEY,\n    customer_id  INTEGER REFERENCES customers (customer_id),\n    order_date   DATE,\n    status       VARCHAR(15)\n);\n\nCREATE TABLE order_items (\n    item_id     INTEGER PRIMARY KEY,\n    order_id    INTEGER REFERENCES orders (order_id),\n    product_id  INTEGER REFERENCES products (product_id),\n    quantity    INTEGER\n);\n\nINSERT INTO customers VALUES\n    (1, 'Ali Khan',     'Hyderabad', '2025-11-02'),\n    (2, 'Ayesha Rao',   'Mumbai',    '2025-12-15'),\n    (3, 'Ravi Kumar',   'Bengaluru', '2026-01-08'),\n    (4, 'John Mathew',  'Chennai',   '2026-01-20'),\n    (5, 'Priya Sharma', 'Hyderabad', '2026-02-11');\n\nINSERT INTO products VALUES\n    (1, 'Laptop',       'Electronics', 55000),\n    (2, 'Mobile',       'Electronics', 20000),\n    (3, 'Headphones',   'Electronics', 3000),\n    (4, 'Notebook',     'Stationery',  150),\n    (5, 'Pen',          'Stationery',  20),\n    (6, 'Office Chair', 'Furniture',   7500);\n\nINSERT INTO orders VALUES\n    (1001, 1, '2026-01-05', 'Delivered'),\n    (1002, 2, '2026-01-18', 'Delivered'),\n    (1003, 1, '2026-02-02', 'Shipped'),\n    (1004, 3, '2026-02-14', 'Cancelled'),\n    (1005, 4, '2026-03-09', 'Delivered'),\n    (1006, 2, '2026-03-21', 'Delivered');\n\nINSERT INTO order_items VALUES\n    (1, 1001, 1, 1),\n    (2, 1001, 3, 2),\n    (3, 1002, 2, 1),\n    (4, 1003, 4, 10),\n    (5, 1003, 5, 20),\n    (6, 1004, 6, 1),\n    (7, 1005, 3, 1),\n    (8, 1006, 1, 1),\n    (9, 1006, 4, 5);";
  const SETUP_SALES = "CREATE TABLE sales_data (\n    sale_id      INTEGER PRIMARY KEY,\n    region       VARCHAR(20),\n    salesperson  VARCHAR(30),\n    product      VARCHAR(30),\n    quantity     INTEGER,\n    amount       NUMERIC(10,2),\n    sale_date    DATE\n);\n\nINSERT INTO sales_data VALUES\n    (1,  'South', 'Ali Khan',     'Laptop',     1,  55000, '2026-01-05'),\n    (2,  'South', 'Ayesha Rao',   'Mobile',     2,  40000, '2026-01-18'),\n    (3,  'North', 'Ravi Kumar',   'Laptop',     1,  55000, '2026-02-02'),\n    (4,  'North', 'John Mathew',  'Headphones', 3,   9000, '2026-02-14'),\n    (5,  'West',  'Priya Sharma', 'Mobile',     1,  20000, '2026-02-20'),\n    (6,  'West',  'Meena Iyer',   'Laptop',     2, 110000, '2026-03-09'),\n    (7,  'South', 'Ali Khan',     'Headphones', 2,   6000, '2026-03-21'),\n    (8,  'North', 'Ravi Kumar',   'Mobile',     3,  60000, '2026-03-25'),\n    (9,  'West',  'Priya Sharma', 'Headphones', 1,   3000, '2026-03-28'),\n    (10, 'South', 'Ayesha Rao',   'Laptop',     1,  55000, '2026-04-04');";

  /* ---- captured outputs (generated) --------------------------------------- */
  const OUT = {
 "intro_q1": " dept_name | location\n-----------+-----------\n Sales     | Hyderabad\n(1 row)",
 "setup_q1": "  greeting\n-------------\n Hello, SQL!\n(1 row)",
 "setup_q2": " total | product\n-------+---------\n    15 |      50\n(1 row)",
 "setup_q3": " current_database | current_user\n------------------+--------------\n postgres         | postgres\n(1 row)",
 "setup_q4": "  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Meena Iyer  | 82000.00\n(3 rows)",
 "err_syntax": "ERROR:  syntax error at or near \"SELEC\"\nLINE 1: SELEC * FROM departments;\n        ^",
 "err_table": "ERROR:  relation \"department\" does not exist\nLINE 1: SELECT * FROM department;\n                      ^",
 "err_column": "ERROR:  column \"emp_nme\" does not exist\nLINE 1: SELECT emp_nme FROM employees;\n               ^\nHINT:  Perhaps you meant to reference the column \"employees.emp_name\".",
 "err_comma": "  salary\n----------\n Ali Khan\n(1 row)",
 "err_dup": "ERROR:  duplicate key value violates unique constraint \"departments_pkey\"\nDETAIL:  Key (dept_id)=(10) already exists.",
 "db_current": " current_database\n------------------\n postgres\n(1 row)",
 "sch_create": "CREATE SCHEMA\nCREATE SCHEMA\nNOTICE:  schema \"hr\" already exists, skipping\nCREATE SCHEMA",
 "sch_list": " schema_name\n-------------\n hr\n public\n sales\n(3 rows)",
 "sch_tables": "CREATE TABLE\nCREATE TABLE\nINSERT 0 2\n customer_id | customer_name\n-------------+---------------\n           1 | Ali Khan\n           2 | Ayesha Rao\n(2 rows)",
 "sch_where": " table_schema | table_name\n--------------+------------\n hr           | customers\n public       | employees\n sales        | customers\n(3 rows)",
 "sch_sp2": "ERROR:  relation \"customers\" does not exist\nLINE 1: SELECT * FROM customers;\n                      ^",
 "sch_sp3": "SET\n customer_id | customer_name\n-------------+---------------\n           1 | Ali Khan\n           2 | Ayesha Rao\n(2 rows)",
 "sch_alter": "ALTER SCHEMA\n   schema_name\n-----------------\n human_resources\n(1 row)",
 "sch_drop1": "ERROR:  cannot drop schema sales because other objects depend on it\nDETAIL:  table customers depends on schema sales\nHINT:  Use DROP ... CASCADE to drop the dependent objects too.",
 "sch_drop2": "RESET\nNOTICE:  drop cascades to table sales.customers\nDROP SCHEMA\nNOTICE:  drop cascades to table human_resources.customers\nDROP SCHEMA\nNOTICE:  schema \"sales\" does not exist, skipping\nDROP SCHEMA",
 "dt_float": "      float_sum      | exact_sum\n---------------------+-----------\n 0.30000000000000004 |       0.3\n(1 row)",
 "dt_intdiv": " int_division |  decimal_division  | remainder\n--------------+--------------------+-----------\n            3 | 3.3333333333333333 |         1\n(1 row)",
 "dt_overflow": "ERROR:  integer out of range",
 "dt_char": " char_value | char_bytes | varchar_bytes\n------------+------------+---------------\n ab         |          5 |             2\n(1 row)",
 "dt_toolong": "CREATE TABLE\nINSERT 0 1\nERROR:  value too long for type character varying(5)",
 "dt_dates": "SET\n     d      |    t     |         ts          |           tstz\n------------+----------+---------------------+---------------------------\n 2026-11-05 | 14:30:00 | 2026-11-05 14:30:00 | 2026-11-05 14:30:00+05:30\n(1 row)",
 "dt_bool": " a | b | c | d\n---+---+---+---\n t | t | f | t\n(1 row)",
 "dt_other": " name | first_skill |                  id\n------+-------------+--------------------------------------\n Ali  | SQL         | a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\n(1 row)",
 "ct_simple": "CREATE TABLE",
 "ct_describe": " column_name  |     data_type     | max_len | is_nullable\n--------------+-------------------+---------+-------------\n student_id   | integer           |         | YES\n student_name | character varying |      50 | YES\n age          | integer           |         | YES\n(3 rows)",
 "ct_first_row": "INSERT 0 1\n student_id | student_name | age\n------------+--------------+-----\n          1 | Ali          |  20\n(1 row)",
 "ct_multi": "CREATE TABLE",
 "ct_multi_ins": "INSERT 0 1\n product_name | unit_price | is_active |  added_on\n--------------+------------+-----------+------------\n Laptop       |   55000.00 | t         | 2026-10-01\n(1 row)",
 "ct_constraints": "CREATE TABLE",
 "ct_constraints_ins": "INSERT 0 1\n course_id | course_name |   fee   | duration\n-----------+-------------+---------+----------\n         1 | SQL Basics  | 4999.00 |       30\n(1 row)",
 "ct_constraints_err": "ERROR:  new row for relation \"courses\" violates check constraint \"courses_fee_check\"\nDETAIL:  Failing row contains (2, Python, -100.00, 30).",
 "ct_identity": "CREATE TABLE\nINSERT 0 3\n trainer_id | trainer_name\n------------+--------------\n          1 | Ravi\n          2 | Meena\n          3 | John\n(3 rows)",
 "ct_like": "CREATE TABLE\n rows_in_archive\n-----------------\n               0\n(1 row)",
 "ct_ctas": "SELECT 4\n emp_id |  emp_name   |  salary\n--------+-------------+----------\n    102 | Ayesha Rao  | 62000.00\n    103 | Ravi Kumar  | 75000.00\n    104 | John Mathew | 68000.00\n    106 | Meena Iyer  | 82000.00\n(4 rows)",
 "al_setup": "CREATE TABLE\nINSERT 0 3",
 "al_list": " table_name\n------------\n trainees\n(1 row)",
 "al_desc": " column_name  |     data_type     | max_len | is_nullable\n--------------+-------------------+---------+-------------\n trainee_id   | integer           |         | NO\n trainee_name | character varying |      30 | YES\n score        | integer           |         | YES\n(3 rows)",
 "al_add": "ALTER TABLE\n trainee_id | trainee_name | score | city\n------------+--------------+-------+------\n          1 | Ali          |    85 |\n          2 | Ayesha       |    92 |\n          3 | Ravi         |    76 |\n(3 rows)",
 "al_add_default": "ALTER TABLE\n trainee_id | trainee_name | score | city | status\n------------+--------------+-------+------+--------\n          1 | Ali          |    85 |      | active\n          2 | Ayesha       |    92 |      | active\n          3 | Ravi         |    76 |      | active\n(3 rows)",
 "al_type": "ALTER TABLE\n trainee_name | score\n--------------+-------\n Ali          | 85.00\n Ayesha       | 92.00\n Ravi         | 76.00\n(3 rows)",
 "al_type_err": "ALTER TABLE\nUPDATE 3\nERROR:  column \"batch\" cannot be cast automatically to type integer\nHINT:  You might need to specify \"USING batch::integer\".",
 "al_type_using": "ALTER TABLE\n trainee_name | batch\n--------------+-------\n Ali          |   101\n Ayesha       |   101\n Ravi         |   101\n(3 rows)",
 "al_default": "ALTER TABLE\nINSERT 0 1\n trainee_name |  status\n--------------+----------\n Ali          | active\n Ayesha       | active\n Ravi         | active\n John         | inactive\n(4 rows)",
 "al_default_drop": "ALTER TABLE",
 "al_nn_err": "ERROR:  column \"city\" of relation \"trainees\" contains null values",
 "al_nn_ok": "UPDATE 4\nALTER TABLE",
 "al_nn_drop": "ALTER TABLE",
 "al_rename_col": "ALTER TABLE\n trainee_id | full_name | score |   city    |  status  | batch\n------------+-----------+-------+-----------+----------+-------\n          1 | Ali       | 85.00 | Hyderabad | active   |   101\n          2 | Ayesha    | 92.00 | Hyderabad | active   |   101\n          3 | Ravi      | 76.00 | Hyderabad | active   |   101\n          4 | John      |       | Hyderabad | inactive |\n(4 rows)",
 "al_drop_col": "ALTER TABLE\nALTER TABLE\n trainee_id | full_name | score |   city\n------------+-----------+-------+-----------\n          1 | Ali       | 85.00 | Hyderabad\n          2 | Ayesha    | 92.00 | Hyderabad\n          3 | Ravi      | 76.00 | Hyderabad\n          4 | John      |       | Hyderabad\n(4 rows)",
 "al_rename_tbl": "ALTER TABLE\n rows_in_learners\n------------------\n                4\n(1 row)",
 "al_drop": "DROP TABLE\nNOTICE:  table \"learners\" does not exist, skipping\nDROP TABLE",
 "al_trunc_setup": "CREATE TABLE\nINSERT 0 3\nDELETE 3\nINSERT 0 1\n ticket_id | note\n-----------+------\n         4 | d\n(1 row)",
 "al_trunc": "TRUNCATE TABLE\nINSERT 0 1\n ticket_id | note\n-----------+------\n         1 | e\n(1 row)",
 "cn_nn": "CREATE TABLE\nINSERT 0 1\nERROR:  null value in column \"customer_name\" of relation \"customers_demo\" violates not-null constraint\nDETAIL:  Failing row contains (2, null, 9123456780).\nERROR:  null value in column \"customer_name\" of relation \"customers_demo\" violates not-null constraint\nDETAIL:  Failing row contains (3, null, 9000000000).",
 "cn_uq": "CREATE TABLE\nINSERT 0 2\nERROR:  duplicate key value violates unique constraint \"users_demo_email_key\"\nDETAIL:  Key (email)=(ali@example.com) already exists.",
 "cn_uq_null": "INSERT 0 2\n user_id |       email        | username\n---------+--------------------+----------\n       1 | ali@example.com    | ali\n       2 | ayesha@example.com | ayesha\n       4 |                    | guest1\n       5 |                    | guest2\n(4 rows)",
 "cn_pk": "CREATE TABLE\nINSERT 0 2\nERROR:  duplicate key value violates unique constraint \"dept_demo_pkey\"\nDETAIL:  Key (dept_id)=(10) already exists.\nERROR:  null value in column \"dept_id\" of relation \"dept_demo\" violates not-null constraint\nDETAIL:  Failing row contains (null, Legal).",
 "cn_fk": "CREATE TABLE\nINSERT 0 2\nERROR:  insert or update on table \"emp_demo\" violates foreign key constraint \"emp_demo_dept_id_fkey\"\nDETAIL:  Key (dept_id)=(99) is not present in table \"dept_demo\".",
 "cn_fk_parent": "ERROR:  update or delete on table \"dept_demo\" violates foreign key constraint \"emp_demo_dept_id_fkey\" on table \"emp_demo\"\nDETAIL:  Key (dept_id)=(10) is still referenced from table \"emp_demo\".",
 "cn_ck": "CREATE TABLE\nINSERT 0 1\nERROR:  new row for relation \"payroll_demo\" violates check constraint \"payroll_demo_salary_check\"\nDETAIL:  Failing row contains (2, -5.00, 30).\nERROR:  new row for relation \"payroll_demo\" violates check constraint \"chk_age\"\nDETAIL:  Failing row contains (3, 40000.00, 17).",
 "cn_df": "CREATE TABLE\nINSERT 0 1\nINSERT 0 1\n ticket_id |    subject     | status | priority\n-----------+----------------+--------+----------\n         1 | Login problem  | open   |        3\n         2 | Refund request | closed |        3\n(2 rows)",
 "cn_cpk": "CREATE TABLE\nINSERT 0 3\nERROR:  duplicate key value violates unique constraint \"enrollments_pkey\"\nDETAIL:  Key (student_id, course_id)=(1, 101) already exists.",
 "cn_alter": "CREATE TABLE\nALTER TABLE\nALTER TABLE\nALTER TABLE\nALTER TABLE\nALTER TABLE",
 "cn_list": "  constraint_name   | type |                definition\n--------------------+------+-------------------------------------------\n chk_vendors_rating | c    | CHECK (((rating >= 1) AND (rating <= 5)))\n pk_vendors         | p    | PRIMARY KEY (vendor_id)\n uq_vendors_gst     | u    | UNIQUE (gst_no)\n(3 rows)",
 "cn_drop": "ALTER TABLE\nALTER TABLE\nALTER TABLE\nALTER TABLE",
 "cn_ri_setup": "CREATE TABLE\nCREATE TABLE\nCREATE TABLE\nCREATE TABLE\nINSERT 0 2\nINSERT 0 2\nINSERT 0 2\nINSERT 0 1",
 "cn_ri_del": "DELETE 1\n emp_id | emp_name | dept_id\n--------+----------+---------\n      1 | Ali      |      10\n(1 row)\n\n emp_id | emp_name | dept_id\n--------+----------+---------\n      1 | Ali      |      10\n      2 | Ayesha   |\n(2 rows)",
 "cn_ri_restrict": "ERROR:  update or delete on table \"ri_dept\" violates RESTRICT setting of foreign key constraint \"ri_emp_restrict_dept_id_fkey\" on table \"ri_emp_restrict\"\nDETAIL:  Key (dept_id)=(10) is referenced from table \"ri_emp_restrict\".",
 "in_create": "CREATE TABLE",
 "in_single": "INSERT 0 1",
 "in_multi": "INSERT 0 3\n student_id | student_name |       email        | age |   city    | joined_on\n------------+--------------+--------------------+-----+-----------+------------\n          1 | Ali Khan     | ali@example.com    |  20 | Hyderabad | 2026-06-15\n          2 | Ayesha Rao   | ayesha@example.com |  21 | Mumbai    | 2026-06-16\n          3 | Ravi Kumar   | ravi@example.com   |  19 | Bengaluru | 2026-06-17\n          4 | Meena Iyer   | meena@example.com  |  22 | Chennai   | 2026-06-18\n(4 rows)",
 "in_cols": "INSERT 0 1\n student_id | student_name | age |   city    | joined_on\n------------+--------------+-----+-----------+------------\n          5 | John Mathew  |     | Hyderabad | 2026-01-01\n(1 row)",
 "in_default": "INSERT 0 1",
 "in_null": "INSERT 0 1\n student_id | student_name |       email        | age\n------------+--------------+--------------------+-----\n          1 | Ali Khan     | ali@example.com    |  20\n          2 | Ayesha Rao   | ayesha@example.com |  21\n          3 | Ravi Kumar   | ravi@example.com   |  19\n          4 | Meena Iyer   | meena@example.com  |  22\n          5 | John Mathew  | john@example.com   |\n          6 | Priya Sharma | priya@example.com  |\n          7 | Karan Mehta  |                    |\n(7 rows)",
 "in_select": "CREATE TABLE\nINSERT 0 4\n student_id | student_name |   city\n------------+--------------+-----------\n          1 | Ali Khan     | Hyderabad\n          5 | John Mathew  | Hyderabad\n          6 | Priya Sharma | Hyderabad\n          7 | Karan Mehta  | Hyderabad\n(4 rows)",
 "in_returning": " student_id |  student_name  |   city    | joined_on\n------------+----------------+-----------+------------\n          8 | Sara Fernandes | Hyderabad | 2026-01-01\n(1 row)\n\nINSERT 0 1",
 "in_dup": "ERROR:  duplicate key value violates unique constraint \"students_email_key\"\nDETAIL:  Key (email)=(ali@example.com) already exists.",
 "in_nothing": "INSERT 0 0",
 "in_upsert": " student_id | student_name | age\n------------+--------------+-----\n          1 | Ali Khan     |  21\n(1 row)\n\nINSERT 0 1",
 "in_err1": "ERROR:  INSERT has more target columns than expressions\nLINE 1: INSERT INTO students (student_name, email) VALUES ('Sara');\n                                            ^",
 "in_err2": "ERROR:  invalid input syntax for type integer: \"twenty\"\nLINE 1: INSERT INTO students (student_name, age) VALUES ('Tina', 'twenty');\n                                                                 ^",
 "in_err3": "ERROR:  date/time field value out of range: \"31-02-2026\"\nLINE 1: INSERT INTO students (student_name, joined_on) VALUES ('Tina', '31-02-2026');\n                                                                       ^\nHINT:  Perhaps you need a different \"DateStyle\" setting.",
 "imp_stage": "CREATE TABLE\nINSERT 0 5",
 "imp_inspect": " total_rows | quantity_filled | date_filled\n------------+-----------------+-------------\n          5 |               4 |           4\n(1 row)",
 "imp_bad": " order_id | product | price\n----------+---------+--------\n 5        | Pen     | twenty\n(1 row)",
 "imp_clean": "CREATE TABLE\nINSERT 0 4\n order_id | customer_name |  product   | quantity |  price   | order_date\n----------+---------------+------------+----------+----------+------------\n        1 | Ali Khan      | Laptop     |        1 | 55000.00 | 2026-01-05\n        2 | Ayesha Rao    | Mobile     |        2 | 20000.00 | 2026-01-18\n        3 | Ravi Kumar    | Headphones |        1 |  3000.00 | 2026-02-02\n        4 | John Mathew   | Notebook   |       10 |   150.00 |\n(4 rows)",
 "imp_verify": " rows_loaded | first_date | last_date  | total_value\n-------------+------------+------------+-------------\n           4 | 2026-01-05 | 2026-02-02 |    99500.00\n(1 row)",
 "up_single": "UPDATE 1\n emp_id |  emp_name   |  salary\n--------+-------------+----------\n    107 | Karan Mehta | 60000.00\n(1 row)",
 "up_multi": "UPDATE 1\n emp_id |  emp_name   |  salary  |   city\n--------+-------------+----------+-----------\n    104 | John Mathew | 70000.00 | Hyderabad\n(1 row)",
 "up_calc": "UPDATE 3\n  emp_name   |  salary\n-------------+----------\n Ali Khan    | 60500.00\n Ayesha Rao  | 68200.00\n Karan Mehta | 66000.00\n(3 rows)",
 "up_cond": "UPDATE 1",
 "up_null": "UPDATE 1",
 "up_null_wrong": "UPDATE 0",
 "up_subq_where": "UPDATE 2",
 "up_subq_set": "UPDATE 1\n emp_id |    emp_name    | commission\n--------+----------------+------------\n    108 | Sara Fernandes |    4666.67\n(1 row)",
 "up_from": "UPDATE 3\n  emp_name   |   city\n-------------+-----------\n Ravi Kumar  | Bengaluru\n John Mathew | Bengaluru\n Meena Iyer  | Bengaluru\n(3 rows)",
 "up_returning": " emp_id | emp_name |  salary\n--------+----------+----------\n    101 | Ali Khan | 61500.00\n(1 row)\n\nUPDATE 1",
 "up_mistake": "BEGIN\nUPDATE 8\n  emp_name  | salary\n------------+--------\n Ali Khan   |   0.00\n Ayesha Rao |   0.00\n Ravi Kumar |   0.00\n(3 rows)\n\nROLLBACK\n  emp_name  |  salary\n------------+----------\n Ali Khan   | 61500.00\n Ayesha Rao | 68200.00\n Ravi Kumar | 75000.00\n(3 rows)",
 "de_one": "DELETE 1",
 "de_where": "DELETE 1",
 "de_subq": "DELETE 1",
 "de_using": "DELETE 1",
 "de_returning": " emp_id |  emp_name  |  salary\n--------+------------+----------\n    106 | Meena Iyer | 82000.00\n(1 row)\n\nDELETE 1",
 "de_fk": "ERROR:  update or delete on table \"departments\" violates foreign key constraint \"employees_dept_id_fkey\" on table \"employees\"\nDETAIL:  Key (dept_id)=(10) is still referenced from table \"employees\".",
 "de_fk_ok": "DELETE 1",
 "de_txn": "BEGIN\nDELETE 3\n rows_inside_transaction\n-------------------------\n                       0\n(1 row)\n\nROLLBACK\n rows_after_rollback\n---------------------\n                   3\n(1 row)",
 "de_soft": "ALTER TABLE\nUPDATE 1\n emp_id |  emp_name\n--------+------------\n    101 | Ali Khan\n    102 | Ayesha Rao\n(2 rows)",
 "se_all": " dept_id | dept_name | location\n---------+-----------+-----------\n      10 | Sales     | Hyderabad\n      20 | HR        | Mumbai\n      30 | IT        | Bengaluru\n      40 | Finance   | Chennai\n(4 rows)",
 "se_cols": "    emp_name    |  salary\n----------------+----------\n Ali Khan       | 55000.00\n Ayesha Rao     | 62000.00\n Ravi Kumar     | 75000.00\n John Mathew    | 68000.00\n Priya Sharma   | 48000.00\n Meena Iyer     | 82000.00\n Karan Mehta    | 45000.00\n Sara Fernandes | 52000.00\n(8 rows)",
 "se_cols2": "   city    |  emp_name  | emp_id\n-----------+------------+--------\n Hyderabad | Ali Khan   |    101\n Hyderabad | Ayesha Rao |    102\n Bengaluru | Ravi Kumar |    103\n(3 rows)",
 "se_distinct": "   city\n-----------\n Bengaluru\n Chennai\n Hyderabad\n Mumbai\n(4 rows)",
 "se_distinct2": " dept_id |   city\n---------+-----------\n      10 | Hyderabad\n      20 | Mumbai\n      30 | Bengaluru\n      30 | Chennai\n         | Mumbai\n(5 rows)",
 "se_alias": "  employee   | monthly_salary | Annual Salary\n-------------+----------------+---------------\n Ali Khan    |       55000.00 |     660000.00\n Ayesha Rao  |       62000.00 |     744000.00\n Karan Mehta |       45000.00 |     540000.00\n(3 rows)",
 "se_tbl_alias": "  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Meena Iyer  | 82000.00\n(3 rows)",
 "se_concat": "          description\n-------------------------------\n Ali Khan works in Hyderabad\n Ayesha Rao works in Hyderabad\n Ravi Kumar works in Bengaluru\n(3 rows)",
 "se_concat_null": "  emp_name  |     with_pipes     |    with_concat     |    with_separator\n------------+--------------------+--------------------+-----------------------\n Ali Khan   | Ali Khan / 5000.00 | Ali Khan / 5000.00 | Ali Khan, Hyderabad\n Ravi Kumar |                    | Ravi Kumar /       | Ravi Kumar, Bengaluru\n(2 rows)",
 "se_arith": " addition | subtraction | multiplication | integer_division |  decimal_division  | remainder\n----------+-------------+----------------+------------------+--------------------+-----------\n       19 |          11 |             60 |                3 | 3.7500000000000000 |         3\n(1 row)",
 "se_calc": "  emp_name   |  salary  | annual_salary | bonus_10_percent\n-------------+----------+---------------+------------------\n Ali Khan    | 55000.00 |     660000.00 |        5500.0000\n Ayesha Rao  | 62000.00 |     744000.00 |        6200.0000\n Karan Mehta | 45000.00 |     540000.00 |        4500.0000\n(3 rows)",
 "se_prec": " without_brackets | with_brackets\n------------------+---------------\n               14 |            20\n(1 row)",
 "se_null": "    emp_name    |  salary  | commission | total_pay\n----------------+----------+------------+-----------\n Ali Khan       | 55000.00 |    5000.00 |  60000.00\n Ayesha Rao     | 62000.00 |    7000.00 |  69000.00\n Ravi Kumar     | 75000.00 |            |\n John Mathew    | 68000.00 |            |\n Priya Sharma   | 48000.00 |            |\n Meena Iyer     | 82000.00 |            |\n Karan Mehta    | 45000.00 |    2000.00 |  47000.00\n Sara Fernandes | 52000.00 |            |\n(8 rows)",
 "se_null_fix": "    emp_name    | total_pay\n----------------+-----------\n Ali Khan       |  60000.00\n Ayesha Rao     |  69000.00\n Ravi Kumar     |  75000.00\n John Mathew    |  68000.00\n Priya Sharma   |  48000.00\n Meena Iyer     |  82000.00\n Karan Mehta    |  47000.00\n Sara Fernandes |  52000.00\n(8 rows)",
 "wh_eq": "  emp_name   | dept_id\n-------------+---------\n Ravi Kumar  |      30\n John Mathew |      30\n Meena Iyer  |      30\n(3 rows)",
 "wh_gt": "  emp_name  |  salary\n------------+----------\n Ravi Kumar | 75000.00\n Meena Iyer | 82000.00\n(2 rows)",
 "wh_lt": "   emp_name   |  salary\n--------------+----------\n Priya Sharma | 48000.00\n Karan Mehta  | 45000.00\n(2 rows)",
 "wh_ge": "  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Meena Iyer  | 82000.00\n(3 rows)",
 "wh_le": "    emp_name    |  salary\n----------------+----------\n Priya Sharma   | 48000.00\n Karan Mehta    | 45000.00\n Sara Fernandes | 52000.00\n(3 rows)",
 "wh_ne": "    emp_name    |   city\n----------------+-----------\n Ravi Kumar     | Bengaluru\n John Mathew    | Bengaluru\n Priya Sharma   | Mumbai\n Meena Iyer     | Chennai\n Sara Fernandes | Mumbai\n(5 rows)",
 "wh_text": "  emp_name   |   city\n-------------+-----------\n Ali Khan    | Hyderabad\n Ayesha Rao  | Hyderabad\n Karan Mehta | Hyderabad\n(3 rows)",
 "wh_text_case": " emp_name | city\n----------+------\n(0 rows)",
 "wh_date": "    emp_name    | hire_date\n----------------+------------\n Priya Sharma   | 2022-02-14\n Sara Fernandes | 2023-01-10\n Karan Mehta    | 2023-06-01\n(3 rows)",
 "wh_and": "  emp_name  | dept_id |  salary\n------------+---------+----------\n Ravi Kumar |      30 | 75000.00\n Meena Iyer |      30 | 82000.00\n(2 rows)",
 "wh_or": "   emp_name   | dept_id\n--------------+---------\n Ali Khan     |      10\n Ayesha Rao   |      10\n Priya Sharma |      20\n Karan Mehta  |      10\n(4 rows)",
 "wh_not": "    emp_name    |   city\n----------------+-----------\n Ravi Kumar     | Bengaluru\n John Mathew    | Bengaluru\n Priya Sharma   | Mumbai\n Meena Iyer     | Chennai\n Sara Fernandes | Mumbai\n(5 rows)",
 "wh_combo": "  emp_name  |   city    |  salary\n------------+-----------+----------\n Ali Khan   | Hyderabad | 55000.00\n Ayesha Rao | Hyderabad | 62000.00\n(2 rows)",
 "wh_prec1": "  emp_name   | dept_id |  salary\n-------------+---------+----------\n Ali Khan    |      10 | 55000.00\n Ayesha Rao  |      10 | 62000.00\n Ravi Kumar  |      30 | 75000.00\n John Mathew |      30 | 68000.00\n Meena Iyer  |      30 | 82000.00\n Karan Mehta |      10 | 45000.00\n(6 rows)",
 "wh_prec2": "  emp_name   | dept_id |  salary\n-------------+---------+----------\n Ravi Kumar  |      30 | 75000.00\n John Mathew |      30 | 68000.00\n Meena Iyer  |      30 | 82000.00\n(3 rows)",
 "sp_in": "    emp_name    |   city\n----------------+-----------\n Ali Khan       | Hyderabad\n Ayesha Rao     | Hyderabad\n Priya Sharma   | Mumbai\n Karan Mehta    | Hyderabad\n Sara Fernandes | Mumbai\n(5 rows)",
 "sp_notin": "  emp_name   |   city\n-------------+-----------\n Ravi Kumar  | Bengaluru\n John Mathew | Bengaluru\n Meena Iyer  | Chennai\n(3 rows)",
 "sp_notin_null": " emp_name\n----------\n(0 rows)",
 "sp_between": "    emp_name    |  salary\n----------------+----------\n Sara Fernandes | 52000.00\n Ali Khan       | 55000.00\n Ayesha Rao     | 62000.00\n John Mathew    | 68000.00\n(4 rows)",
 "sp_notbetween": "   emp_name   |  salary\n--------------+----------\n Karan Mehta  | 45000.00\n Priya Sharma | 48000.00\n Ravi Kumar   | 75000.00\n Meena Iyer   | 82000.00\n(4 rows)",
 "sp_between_date": "  emp_name  | hire_date\n------------+------------\n Ayesha Rao | 2019-07-01\n Ali Khan   | 2020-03-15\n(2 rows)",
 "sp_like1": "  emp_name\n------------\n Ali Khan\n Ayesha Rao\n(2 rows)",
 "sp_like2": "  emp_name\n------------\n Ravi Kumar\n(1 row)",
 "sp_like3": "    emp_name\n----------------\n Ali Khan\n Karan Mehta\n Sara Fernandes\n(3 rows)",
 "sp_like4": "  emp_name\n-------------\n John Mathew\n(1 row)",
 "sp_like_case": " emp_name\n----------\n(0 rows)",
 "sp_ilike": "  emp_name\n------------\n Ravi Kumar\n(1 row)",
 "sp_null_wrong": " emp_name | commission\n----------+------------\n(0 rows)",
 "sp_isnull": "    emp_name    | commission\n----------------+------------\n Ravi Kumar     |\n John Mathew    |\n Priya Sharma   |\n Meena Iyer     |\n Sara Fernandes |\n(5 rows)",
 "sp_isnotnull": "  emp_name   | commission\n-------------+------------\n Ali Khan    |    5000.00\n Ayesha Rao  |    7000.00\n Karan Mehta |    2000.00\n(3 rows)",
 "sp_coalesce": "    emp_name    | commission | commission_or_zero | commission_label\n----------------+------------+--------------------+------------------\n Ali Khan       |    5000.00 |            5000.00 | 5000.00\n Ayesha Rao     |    7000.00 |            7000.00 | 7000.00\n Ravi Kumar     |            |                  0 | no commission\n John Mathew    |            |                  0 | no commission\n Priya Sharma   |            |                  0 | no commission\n Meena Iyer     |            |                  0 | no commission\n Karan Mehta    |    2000.00 |            2000.00 | 2000.00\n Sara Fernandes |            |                  0 | no commission\n(8 rows)",
 "sp_div0": "ERROR:  division by zero",
 "sp_nullif": " result\n--------\n\n(1 row)",
 "sp_shop1": " product_name |  price\n--------------+----------\n Laptop       | 55000.00\n Mobile       | 20000.00\n Office Chair |  7500.00\n(3 rows)",
 "sp_shop2": " customer_name |   city\n---------------+-----------\n Ali Khan      | Hyderabad\n Ayesha Rao    | Mumbai\n(2 rows)",
 "sp_shop3": " order_id | order_date |  status\n----------+------------+-----------\n     1003 | 2026-02-02 | Shipped\n     1004 | 2026-02-14 | Cancelled\n(2 rows)",
 "sp_shop4": " order_id | customer_id | order_date\n----------+-------------+------------\n     1001 |           1 | 2026-01-05\n     1002 |           2 | 2026-01-18\n     1005 |           4 | 2026-03-09\n     1006 |           2 | 2026-03-21\n(4 rows)",
 "or_asc": "    emp_name    |  salary\n----------------+----------\n Karan Mehta    | 45000.00\n Priya Sharma   | 48000.00\n Sara Fernandes | 52000.00\n Ali Khan       | 55000.00\n Ayesha Rao     | 62000.00\n John Mathew    | 68000.00\n Ravi Kumar     | 75000.00\n Meena Iyer     | 82000.00\n(8 rows)",
 "or_desc": "    emp_name    |  salary\n----------------+----------\n Meena Iyer     | 82000.00\n Ravi Kumar     | 75000.00\n John Mathew    | 68000.00\n Ayesha Rao     | 62000.00\n Ali Khan       | 55000.00\n Sara Fernandes | 52000.00\n Priya Sharma   | 48000.00\n Karan Mehta    | 45000.00\n(8 rows)",
 "or_multi": " dept_id |    emp_name    |  salary\n---------+----------------+----------\n      10 | Ayesha Rao     | 62000.00\n      10 | Ali Khan       | 55000.00\n      10 | Karan Mehta    | 45000.00\n      20 | Priya Sharma   | 48000.00\n      30 | Meena Iyer     | 82000.00\n      30 | Ravi Kumar     | 75000.00\n      30 | John Mathew    | 68000.00\n         | Sara Fernandes | 52000.00\n(8 rows)",
 "or_expr": "  emp_name   |  salary  | commission | total_pay\n-------------+----------+------------+-----------\n Meena Iyer  | 82000.00 |            |  82000.00\n Ravi Kumar  | 75000.00 |            |  75000.00\n Ayesha Rao  | 62000.00 |    7000.00 |  69000.00\n John Mathew | 68000.00 |            |  68000.00\n(4 rows)",
 "or_pos": "    emp_name    |   city    |  salary\n----------------+-----------+----------\n Ravi Kumar     | Bengaluru | 75000.00\n John Mathew    | Bengaluru | 68000.00\n Meena Iyer     | Chennai   | 82000.00\n Ayesha Rao     | Hyderabad | 62000.00\n Ali Khan       | Hyderabad | 55000.00\n Karan Mehta    | Hyderabad | 45000.00\n Sara Fernandes | Mumbai    | 52000.00\n Priya Sharma   | Mumbai    | 48000.00\n(8 rows)",
 "or_null1": "    emp_name    | commission\n----------------+------------\n Karan Mehta    |    2000.00\n Ali Khan       |    5000.00\n Ayesha Rao     |    7000.00\n Ravi Kumar     |\n John Mathew    |\n Priya Sharma   |\n Meena Iyer     |\n Sara Fernandes |\n(8 rows)",
 "or_null2": "    emp_name    | commission\n----------------+------------\n Ravi Kumar     |\n John Mathew    |\n Priya Sharma   |\n Meena Iyer     |\n Sara Fernandes |\n Ayesha Rao     |    7000.00\n Ali Khan       |    5000.00\n Karan Mehta    |    2000.00\n(8 rows)",
 "or_null3": "    emp_name    | commission\n----------------+------------\n Ayesha Rao     |    7000.00\n Ali Khan       |    5000.00\n Karan Mehta    |    2000.00\n Ravi Kumar     |\n John Mathew    |\n Priya Sharma   |\n Meena Iyer     |\n Sara Fernandes |\n(8 rows)",
 "or_limit": "  emp_name   |  salary\n-------------+----------\n Meena Iyer  | 82000.00\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n(3 rows)",
 "or_offset": "    emp_name    |  salary\n----------------+----------\n Ayesha Rao     | 62000.00\n Ali Khan       | 55000.00\n Sara Fernandes | 52000.00\n(3 rows)",
 "or_fetch": "  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Ayesha Rao  | 62000.00\n(3 rows)",
 "or_ties": "  emp_name   | dept_id\n-------------+---------\n Ayesha Rao  |      10\n Karan Mehta |      10\n Ali Khan    |      10\n(3 rows)",
 "or_page1": " emp_id |  emp_name\n--------+------------\n    101 | Ali Khan\n    102 | Ayesha Rao\n    103 | Ravi Kumar\n(3 rows)",
 "or_page2": " emp_id |   emp_name\n--------+--------------\n    104 | John Mathew\n    105 | Priya Sharma\n    106 | Meena Iyer\n(3 rows)",
 "or_page3": " emp_id |    emp_name\n--------+----------------\n    107 | Karan Mehta\n    108 | Sara Fernandes\n(2 rows)",
 "ag_count": " total_employees\n-----------------\n               8\n(1 row)",
 "ag_count_where": " hyderabad_staff\n-----------------\n               3\n(1 row)",
 "ag_basic": " total_payroll | average_salary |  lowest  | highest\n---------------+----------------+----------+----------\n     487000.00 |       60875.00 | 45000.00 | 82000.00\n(1 row)",
 "ag_minmax": " earliest_hire | latest_hire | first_alphabetically | last_alphabetically\n---------------+-------------+----------------------+---------------------\n 2017-11-05    | 2023-06-01  | Ali Khan             | Sara Fernandes\n(1 row)",
 "ag_count_col": " all_rows | with_commission | with_department | different_departments\n----------+-----------------+-----------------+-----------------------\n        8 |               3 |               7 |                     3\n(1 row)",
 "ag_null": " avg_of_those_who_have_one | avg_over_all_employees\n---------------------------+------------------------\n                   4666.67 |                1750.00\n(1 row)",
 "ag_empty": " rows_found | total\n------------+-------\n          0 |\n(1 row)",
 "ag_combo": " headcount |  payroll  | avg_salary | salary_gap\n-----------+-----------+------------+------------\n         3 | 225000.00 |   75000.00 |   14000.00\n(1 row)",
 "ag_filter": " sales_staff | it_staff | hyderabad_payroll\n-------------+----------+-------------------\n           3 |        3 |         162000.00\n(1 row)",
 "ag_err1": "ERROR:  column \"employees.emp_name\" must appear in the GROUP BY clause or be used in an aggregate function\nLINE 1: SELECT emp_name, MAX(salary) FROM employees;\n               ^",
 "ag_err2": "ERROR:  aggregate functions are not allowed in WHERE\nLINE 1: SELECT emp_name FROM employees WHERE salary > AVG(salary);\n                                                      ^",
 "ag_fix2": "  emp_name   |  salary\n-------------+----------\n Meena Iyer  | 82000.00\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Ayesha Rao  | 62000.00\n(4 rows)",
 "ag_shop1": " products | cheapest | most_expensive | average_price\n----------+----------+----------------+---------------\n        6 |    20.00 |       55000.00 |      14278.33\n(1 row)",
 "ag_shop2": " units_sold | order_lines\n------------+-------------\n         42 |           9\n(1 row)",
 "ag_shop3": " delivered_orders | first_delivery_order | last_delivery_order\n------------------+----------------------+---------------------\n                4 | 2026-01-05           | 2026-03-21\n(1 row)",
 "gb_dept": " dept_id | headcount\n---------+-----------\n      10 |         3\n      20 |         1\n      30 |         3\n         |         1\n(4 rows)",
 "gb_agg": " dept_id | headcount |  payroll  | avg_salary | top_salary\n---------+-----------+-----------+------------+------------\n      10 |         3 | 162000.00 |   54000.00 |   62000.00\n      20 |         1 |  48000.00 |   48000.00 |   48000.00\n      30 |         3 | 225000.00 |   75000.00 |   82000.00\n         |         1 |  52000.00 |   52000.00 |   52000.00\n(4 rows)",
 "gb_err": "ERROR:  column \"employees.emp_name\" must appear in the GROUP BY clause or be used in an aggregate function\nLINE 1: SELECT dept_id, emp_name, COUNT(*)\n                        ^",
 "gb_multi": " dept_id |   city    | employees\n---------+-----------+-----------\n      10 | Hyderabad |         3\n      20 | Mumbai    |         1\n      30 | Bengaluru |         2\n      30 | Chennai   |         1\n         | Mumbai    |         1\n(5 rows)",
 "gb_having1": " dept_id | headcount\n---------+-----------\n      10 |         3\n      30 |         3\n(2 rows)",
 "gb_having2": " dept_id | avg_salary\n---------+------------\n      30 |   75000.00\n(1 row)",
 "gb_both": " dept_id | headcount | avg_salary\n---------+-----------+------------\n      10 |         2 |   58500.00\n      30 |         3 |   75000.00\n(2 rows)",
 "gb_order": "   city    | employees |  payroll\n-----------+-----------+-----------\n Hyderabad |         3 | 162000.00\n Bengaluru |         2 | 143000.00\n Mumbai    |         2 | 100000.00\n Chennai   |         1 |  82000.00\n(4 rows)",
 "gb_multi_cond": " dept_id |   city    | employees |  payroll\n---------+-----------+-----------+-----------\n      10 | Hyderabad |         3 | 162000.00\n      30 | Bengaluru |         1 |  68000.00\n(2 rows)",
 "gb_s1": " region | sales |  revenue\n--------+-------+-----------\n South  |     4 | 156000.00\n West   |     3 | 133000.00\n North  |     3 | 124000.00\n(3 rows)",
 "gb_s2": " salesperson |  revenue  | units\n-------------+-----------+-------\n Ravi Kumar  | 115000.00 |     4\n Meena Iyer  | 110000.00 |     2\n Ayesha Rao  |  95000.00 |     3\n(3 rows)",
 "gb_s3": " product | units |  revenue\n---------+-------+-----------\n Laptop  |     5 | 275000.00\n Mobile  |     6 | 120000.00\n(2 rows)",
 "gb_s4": " region |  product   |  revenue\n--------+------------+-----------\n North  | Mobile     |  60000.00\n North  | Laptop     |  55000.00\n North  | Headphones |   9000.00\n South  | Laptop     | 110000.00\n South  | Mobile     |  40000.00\n South  | Headphones |   6000.00\n West   | Laptop     | 110000.00\n West   | Mobile     |  20000.00\n West   | Headphones |   3000.00\n(9 rows)",
 "nf_floor": " floor_pos | ceil_pos | floor_neg | ceil_neg\n-----------+----------+-----------+----------\n         7 |        8 |        -8 |       -7\n(1 row)",
 "nf_pages": " wrong_pages | pages_needed\n-------------+--------------\n           4 |            5\n(1 row)",
 "nf_mod": " remainder | same_thing | negative_input\n-----------+------------+----------------\n         2 |          2 |             -2\n(1 row)",
 "nf_mod2": " emp_id |  emp_name   | id_type\n--------+-------------+---------\n    101 | Ali Khan    | odd\n    102 | Ayesha Rao  | even\n    103 | Ravi Kumar  | odd\n    104 | John Mathew | even\n(4 rows)",
 "nf_round": " to_integer | two_decimals | nearest_hundred | numeric_half | float_half\n------------+--------------+-----------------+--------------+------------\n       1235 |      1234.57 |            1200 |            3 |          2\n(1 row)",
 "nf_trunc": " cut_to_integer | cut_to_2 | rounded_to_2 | toward_zero\n----------------+----------+--------------+-------------\n           1234 |  1234.56 |      1234.57 |          -7\n(1 row)",
 "nf_abs": " abs_value | salary_gap\n-----------+------------\n       250 |       7000\n(1 row)",
 "nf_power": " two_to_the_10 | square_root_via_power | sqrt_144 | sqrt_2\n---------------+-----------------------+----------+--------\n          1024 |    3.0000000000000000 |       12 | 1.4142\n(1 row)",
 "nf_prac1": "  emp_name   |  salary  | daily_wage | bonus_nearest_10\n-------------+----------+------------+------------------\n Ali Khan    | 55000.00 |    1833.33 |             4130\n Ayesha Rao  | 62000.00 |    2066.67 |             4650\n Karan Mehta | 45000.00 |    1500.00 |             3380\n(3 rows)",
 "nf_prac2": " maturity_amount\n-----------------\n       146932.81\n(1 row)",
 "nf_prac3": "  emp_name   |  salary  | band_start\n-------------+----------+------------\n Meena Iyer  | 82000.00 |      80000\n Ravi Kumar  | 75000.00 |      70000\n John Mathew | 68000.00 |      60000\n Ayesha Rao  | 62000.00 |      60000\n(4 rows)",
 "sf_setup": "CREATE TABLE\nINSERT 0 3\n id |  full_name   |          email          |    phone\n----+--------------+-------------------------+-------------\n  1 |   aLI kHAN   | ALI.KHAN@Example.COM    | 98765-43210\n  2 | ayesha   RAO | Ayesha.Rao@example.com  | 98123 45678\n  3 | RAVI kumar   | ravi.kumar@EXAMPLE.com  | 91234-56780\n(3 rows)",
 "sf_case": " upper_case | lower_case |     clean_email\n------------+------------+----------------------\n HYDERABAD  | sql course | ali.khan@example.com\n(1 row)",
 "sf_concat": "     joined      | null_is_skipped | null_with_pipes\n-----------------+-----------------+-----------------\n SQL Course 2026 | Name: Ali       |\n(1 row)",
 "sf_length": " letters | chars | bytes |  full_name  | length_with_spaces\n---------+-------+-------+-------------+--------------------\n       9 |     4 |     6 |   aLI kHAN  |                 11\n(1 row)",
 "sf_trim": " both_sides | left_only | right_only | other_character\n------------+-----------+------------+-----------------\n [SQL]      | [SQL   ]  | [   SQL]   | SQL\n(1 row)",
 "sf_pad": " invoice_no |     dotted     | invoice_code\n------------+----------------+--------------\n 00001      |   aLI kHAN ... | INV-0001\n 00002      | ayesha   RAO.. | INV-0002\n 00003      | RAVI kumar.... | INV-0003\n(3 rows)",
 "sf_substr": " first_three | from_4th_take_3 | from_5th_to_end | left_4 | right_4\n-------------+-----------------+-----------------+--------+---------\n Hyd         | era             | rabad           | Hyde   | abad\n(1 row)",
 "sf_mask": "    phone    |   masked\n-------------+------------\n 98765-43210 | 98XXXXXX10\n 98123 45678 | 98XXXXXX78\n 91234-56780 | 91XXXXXX80\n(3 rows)",
 "sf_position": " at_position | first_dot |   domain\n-------------+-----------+-------------\n          11 |         5 | EXAMPLE.com\n(1 row)",
 "sf_split": " user_name  |   domain\n------------+-------------\n ravi.kumar | example.com\n(1 row)",
 "sf_replace": " phone_digits |    replaced    | reversed\n--------------+----------------+----------\n 9876543210   | Data Analytics | LQS\n(1 row)",
 "sf_initcap": "   name_1   |   name_2   |      note\n------------+------------+-----------------\n Ravi Kumar | Meena Iyer | Hello-World Sql\n(1 row)",
 "sf_clean": " id | full_name  |         email          |   phone\n----+------------+------------------------+------------\n  1 | Ali Khan   | ali.khan@example.com   | 9876543210\n  2 | Ayesha Rao | ayesha.rao@example.com | 9812345678\n  3 | Ravi Kumar | ravi.kumar@example.com | 9123456780\n(3 rows)",
 "sf_update": "UPDATE 3\n id | full_name  |         email          |   phone\n----+------------+------------------------+------------\n  1 | Ali Khan   | ali.khan@example.com   | 9876543210\n  2 | Ayesha Rao | ayesha.rao@example.com | 9812345678\n  3 | Ravi Kumar | ravi.kumar@example.com | 9123456780\n(3 rows)",
 "df_age": "      age_of_person      |  time_since_joining\n-------------------------+-----------------------\n 31 years 5 mons 22 days | 3 years 5 mons 5 days\n(1 row)",
 "df_extract": " hire_date  | year | month | day | weekday_0_is_sunday | quarter\n------------+------+-------+-----+---------------------+---------\n 2020-03-15 | 2020 |     3 |  15 |                   0 |       1\n(1 row)",
 "df_extract_where": "    emp_name    | hire_date\n----------------+------------\n Sara Fernandes | 2023-01-10\n Karan Mehta    | 2023-06-01\n(2 rows)",
 "df_trunc": "  original  | month_start | quarter_start | year_start | monday_of_week\n------------+-------------+---------------+------------+----------------\n 2026-11-06 | 2026-11-01  | 2026-10-01    | 2026-01-01 | 2026-11-02\n(1 row)",
 "df_todate": " from_dd_mm_yyyy | from_words\n-----------------+------------\n 2026-08-15      | 2026-03-05\n(1 row)",
 "df_tochar": "   style_1   |         style_2         | year_month | formatted_number\n-------------+-------------------------+------------+------------------\n 06-Nov-2026 | Friday, 6 November 2026 | 2026-11    | 55,000.00\n(1 row)",
 "df_arith": " plus_30_days | days_this_year | plus_3_months | end_of_month_case\n--------------+----------------+---------------+-------------------\n 2026-12-06   |            309 | 2027-02-06    | 2026-02-28\n(1 row)",
 "df_due": " order_date |  due_date\n------------+------------\n 2026-01-05 | 2026-02-19\n 2026-02-14 | 2026-03-31\n(2 rows)",
 "df_exp": "  emp_name   | hire_date  |        service         | full_years\n-------------+------------+------------------------+------------\n Meena Iyer  | 2017-11-05 | 9 years 1 day          |          9\n Ravi Kumar  | 2018-01-20 | 8 years 9 mons 17 days |          8\n Ayesha Rao  | 2019-07-01 | 7 years 4 mons 5 days  |          7\n Ali Khan    | 2020-03-15 | 6 years 7 mons 22 days |          6\n John Mathew | 2021-09-10 | 5 years 1 mon 26 days  |          5\n(5 rows)",
 "df_exp2": "  emp_name   | hire_date\n-------------+------------\n Meena Iyer  | 2017-11-05\n Ravi Kumar  | 2018-01-20\n Ayesha Rao  | 2019-07-01\n Ali Khan    | 2020-03-15\n John Mathew | 2021-09-10\n(5 rows)",
 "df_dur": " days_to_christmas | weeks | age_in_years\n-------------------+-------+--------------\n                49 |   7.0 |           26\n(1 row)",
 "df_dur2": "  worked  |       hours\n----------+--------------------\n 09:15:00 | 9.2500000000000000\n(1 row)",
 "df_month": "   month    | sales |  revenue\n------------+-------+-----------\n 2026-01-01 |     2 |  95000.00\n 2026-02-01 |     3 |  84000.00\n 2026-03-01 |     4 | 179000.00\n 2026-04-01 |     1 |  55000.00\n(4 rows)",
 "df_month2": "  month  | region |  revenue\n---------+--------+-----------\n 2026-01 | South  |  95000.00\n 2026-02 | North  |  64000.00\n 2026-03 | North  |  60000.00\n 2026-03 | West   | 113000.00\n(4 rows)",
 "df_year": " year | quarter |  revenue\n------+---------+-----------\n 2026 |       1 | 358000.00\n 2026 |       2 |  55000.00\n(2 rows)",
 "so_setup": "CREATE TABLE\nCREATE TABLE\nINSERT 0 4\nINSERT 0 5",
 "so_err": "ERROR:  each UNION query must have the same number of columns\nLINE 3: SELECT person_name FROM cust_list;\n               ^",
 "so_union": " person_name  |   city\n--------------+-----------\n Ali Khan     | Hyderabad\n Ayesha Rao   | Hyderabad\n John Mathew  | Chennai\n Meena Iyer   | Chennai\n Priya Sharma | Mumbai\n Ravi Kumar   | Bengaluru\n(6 rows)",
 "so_unionall": " person_name  |   city\n--------------+-----------\n Ali Khan     | Hyderabad\n Ayesha Rao   | Hyderabad\n Ayesha Rao   | Hyderabad\n John Mathew  | Chennai\n John Mathew  | Chennai\n Meena Iyer   | Chennai\n Priya Sharma | Mumbai\n Ravi Kumar   | Bengaluru\n Ravi Kumar   | Bengaluru\n(9 rows)",
 "so_intersect": " person_name |   city\n-------------+-----------\n Ayesha Rao  | Hyderabad\n Ravi Kumar  | Bengaluru\n(2 rows)",
 "so_except": " person_name  |   city\n--------------+-----------\n Ali Khan     | Hyderabad\n Priya Sharma | Mumbai\n(2 rows)",
 "so_except2": " person_name |  city\n-------------+---------\n John Mathew | Chennai\n Meena Iyer  | Chennai\n(2 rows)",
 "so_label": " person_name  |  source\n--------------+----------\n Ayesha Rao   | customer\n John Mathew  | customer\n John Mathew  | customer\n Meena Iyer   | customer\n Ravi Kumar   | customer\n Ali Khan     | employee\n Ayesha Rao   | employee\n Priya Sharma | employee\n Ravi Kumar   | employee\n(9 rows)",
 "so_prac": "   city\n-----------\n Bengaluru\n Chennai\n Hyderabad\n Mumbai\n(4 rows)",
 "jr_ids": "  emp_name   | dept_id\n-------------+---------\n Ali Khan    |      10\n Ayesha Rao  |      10\n Ravi Kumar  |      30\n John Mathew |      30\n(4 rows)",
 "jr_121": "CREATE TABLE\nINSERT 0 2",
 "jr_mm": " item_id | order_id | product_id | quantity\n---------+----------+------------+----------\n       1 |     1001 |          1 |        1\n       2 |     1001 |          3 |        2\n       8 |     1006 |          1 |        1\n       9 |     1006 |          4 |        5\n(4 rows)",
 "jt_inner": " emp_id |   emp_name   | dept_name\n--------+--------------+-----------\n    101 | Ali Khan     | Sales\n    102 | Ayesha Rao   | Sales\n    103 | Ravi Kumar   | IT\n    104 | John Mathew  | IT\n    105 | Priya Sharma | HR\n    106 | Meena Iyer   | IT\n    107 | Karan Mehta  | Sales\n(7 rows)",
 "jt_left": " emp_id |    emp_name    | dept_name\n--------+----------------+-----------\n    101 | Ali Khan       | Sales\n    102 | Ayesha Rao     | Sales\n    103 | Ravi Kumar     | IT\n    104 | John Mathew    | IT\n    105 | Priya Sharma   | HR\n    106 | Meena Iyer     | IT\n    107 | Karan Mehta    | Sales\n    108 | Sara Fernandes |\n(8 rows)",
 "jt_right": " dept_name |   emp_name\n-----------+--------------\n Sales     | Ali Khan\n Sales     | Ayesha Rao\n Sales     | Karan Mehta\n HR        | Priya Sharma\n IT        | Ravi Kumar\n IT        | John Mathew\n IT        | Meena Iyer\n Finance   |\n(8 rows)",
 "jt_full": "    emp_name    | dept_name\n----------------+-----------\n Sara Fernandes |\n                | Finance\n(2 rows)",
 "jt_cross": " dept_name |  shift\n-----------+---------\n Sales     | Evening\n Sales     | Morning\n HR        | Evening\n HR        | Morning\n IT        | Evening\n IT        | Morning\n Finance   | Evening\n Finance   | Morning\n(8 rows)",
 "jt_self": "    employee    |   manager\n----------------+--------------\n Ali Khan       |\n Ayesha Rao     | Ali Khan\n Ravi Kumar     | Ali Khan\n John Mathew    | Ravi Kumar\n Priya Sharma   | Ali Khan\n Meena Iyer     | Ravi Kumar\n Karan Mehta    | Ayesha Rao\n Sara Fernandes | Priya Sharma\n(8 rows)",
 "ja_two": " order_id | customer_name | order_date |  status\n----------+---------------+------------+-----------\n     1001 | Ali Khan      | 2026-01-05 | Delivered\n     1002 | Ayesha Rao    | 2026-01-18 | Delivered\n     1003 | Ali Khan      | 2026-02-02 | Shipped\n     1004 | Ravi Kumar    | 2026-02-14 | Cancelled\n     1005 | John Mathew   | 2026-03-09 | Delivered\n     1006 | Ayesha Rao    | 2026-03-21 | Delivered\n(6 rows)",
 "ja_three": " order_id | customer_name | product_name | quantity |  price   | line_total\n----------+---------------+--------------+----------+----------+------------\n     1001 | Ali Khan      | Laptop       |        1 | 55000.00 |   55000.00\n     1001 | Ali Khan      | Headphones   |        2 |  3000.00 |    6000.00\n     1002 | Ayesha Rao    | Mobile       |        1 | 20000.00 |   20000.00\n     1003 | Ali Khan      | Notebook     |       10 |   150.00 |    1500.00\n     1003 | Ali Khan      | Pen          |       20 |    20.00 |     400.00\n     1004 | Ravi Kumar    | Office Chair |        1 |  7500.00 |    7500.00\n     1005 | John Mathew   | Headphones   |        1 |  3000.00 |    3000.00\n     1006 | Ayesha Rao    | Laptop       |        1 | 55000.00 |   55000.00\n     1006 | Ayesha Rao    | Notebook     |        5 |   150.00 |     750.00\n(9 rows)",
 "ja_revenue": " customer_name | orders | revenue\n---------------+--------+----------\n Ayesha Rao    |      2 | 75750.00\n Ali Khan      |      2 | 62900.00\n John Mathew   |      1 |  3000.00\n(3 rows)",
 "ja_on": " customer_name | order_id |  status\n---------------+----------+-----------\n Ali Khan      |     1001 | Delivered\n Ayesha Rao    |     1002 | Delivered\n Ayesha Rao    |     1006 | Delivered\n Ravi Kumar    |          |\n John Mathew   |     1005 | Delivered\n Priya Sharma  |          |\n(6 rows)",
 "ja_where": " customer_name | order_id |  status\n---------------+----------+-----------\n Ali Khan      |     1001 | Delivered\n Ayesha Rao    |     1002 | Delivered\n Ayesha Rao    |     1006 | Delivered\n John Mathew   |     1005 | Delivered\n(4 rows)",
 "ja_using": " customer_id | order_id | order_date |  status   | customer_name |   city    | signup_date\n-------------+----------+------------+-----------+---------------+-----------+-------------\n           1 |     1001 | 2026-01-05 | Delivered | Ali Khan      | Hyderabad | 2025-11-02\n(1 row)",
 "ja_filter": " customer_name | product_name | quantity\n---------------+--------------+----------\n Ali Khan      | Headphones   |        2\n Ali Khan      | Laptop       |        1\n Ayesha Rao    | Laptop       |        1\n Ayesha Rao    | Mobile       |        1\n John Mathew   | Headphones   |        1\n(5 rows)",
 "ja_anti": " customer_id | customer_name\n-------------+---------------\n           5 | Priya Sharma\n(1 row)",
 "ja_count": " customer_name | orders | wrong_count\n---------------+--------+-------------\n Ali Khan      |      2 |           2\n Ayesha Rao    |      2 |           2\n John Mathew   |      1 |           1\n Priya Sharma  |      0 |           1\n Ravi Kumar    |      1 |           1\n(5 rows)",
 "ja_coalesce": " customer_name |  status\n---------------+-----------\n John Mathew   | Delivered\n Priya Sharma  | No orders\n(2 rows)",
 "ja_self1": "    employee    |  salary  |   manager    | manager_salary\n----------------+----------+--------------+----------------\n Ayesha Rao     | 62000.00 | Ali Khan     |       55000.00\n Ravi Kumar     | 75000.00 | Ali Khan     |       55000.00\n Meena Iyer     | 82000.00 | Ravi Kumar   |       75000.00\n Sara Fernandes | 52000.00 | Priya Sharma |       48000.00\n(4 rows)",
 "ja_self2": "  employee_1  |   employee_2   |   city\n--------------+----------------+-----------\n Ravi Kumar   | John Mathew    | Bengaluru\n Ali Khan     | Ayesha Rao     | Hyderabad\n Ali Khan     | Karan Mehta    | Hyderabad\n Ayesha Rao   | Karan Mehta    | Hyderabad\n Priya Sharma | Sara Fernandes | Mumbai\n(5 rows)",
 "ja_dept": " dept_name | headcount |  payroll\n-----------+-----------+-----------\n Finance   |         0 |         0\n HR        |         1 |  48000.00\n IT        |         3 | 225000.00\n Sales     |         3 | 162000.00\n(4 rows)",
 "sq_intro": "  emp_name   |  salary\n-------------+----------\n Meena Iyer  | 82000.00\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Ayesha Rao  | 62000.00\n(4 rows)",
 "sq_max": "  emp_name  |  salary\n------------+----------\n Meena Iyer | 82000.00\n(1 row)",
 "sq_dept": "  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 75000.00\n John Mathew | 68000.00\n Meena Iyer  | 82000.00\n(3 rows)",
 "sq_err": "ERROR:  more than one row returned by a subquery used as an expression",
 "sq_in": "  emp_name   |   city\n-------------+-----------\n Ali Khan    | Hyderabad\n Ayesha Rao  | Hyderabad\n Karan Mehta | Hyderabad\n(3 rows)",
 "sq_all": "  emp_name   |  salary\n-------------+----------\n John Mathew | 68000.00\n Ravi Kumar  | 75000.00\n Meena Iyer  | 82000.00\n(3 rows)",
 "sq_any": "    emp_name    |  salary\n----------------+----------\n Sara Fernandes | 52000.00\n Ali Khan       | 55000.00\n Ayesha Rao     | 62000.00\n John Mathew    | 68000.00\n Ravi Kumar     | 75000.00\n Meena Iyer     | 82000.00\n(6 rows)",
 "sq_notin": "   emp_name   | dept_id\n--------------+---------\n Ravi Kumar   |      30\n John Mathew  |      30\n Priya Sharma |      20\n Meena Iyer   |      30\n(4 rows)",
 "sq_notin_null": " dept_name\n-----------\n(0 rows)",
 "sq_notin_fix": " dept_name\n-----------\n Finance\n(1 row)",
 "sq_exists": " dept_name\n-----------\n Sales\n HR\n IT\n(3 rows)",
 "sq_notexists": " dept_name\n-----------\n Finance\n(1 row)",
 "sq_corr": "  emp_name  | dept_id |  salary\n------------+---------+----------\n Ali Khan   |      10 | 55000.00\n Ayesha Rao |      10 | 62000.00\n Meena Iyer |      30 | 82000.00\n(3 rows)",
 "sq_select": " dept_name | headcount\n-----------+-----------\n Sales     |         3\n HR        |         1\n IT        |         3\n Finance   |         0\n(4 rows)",
 "sq_from": " dept_name | avg_salary\n-----------+------------\n IT        |   75000.00\n Sales     |   54000.00\n HR        |   48000.00\n(3 rows)",
 "sq_second": " second_highest\n----------------\n       75000.00\n(1 row)",
 "sq_update": "BEGIN\nUPDATE 3\n  emp_name   |  salary\n-------------+----------\n Ravi Kumar  | 78750.00\n John Mathew | 71400.00\n Meena Iyer  | 86100.00\n(3 rows)\n\nROLLBACK",
 "sq_delete": "BEGIN\n dept_name\n-----------\n Finance\n(1 row)\n\nDELETE 1\nROLLBACK",
 "sq_vs_join1": "  emp_name\n-------------\n Ravi Kumar\n John Mathew\n Meena Iyer\n(3 rows)",
 "sq_vs_join2": "  emp_name\n-------------\n Ravi Kumar\n John Mathew\n Meena Iyer\n(3 rows)",
 "sq_shop1": " customer_name\n---------------\n Ali Khan\n Ayesha Rao\n John Mathew\n(3 rows)",
 "sq_shop2": " product_name\n--------------\n Pen\n Office Chair\n(2 rows)",
 "sq_shop3": " product_name |  category   |  price\n--------------+-------------+----------\n Laptop       | Electronics | 55000.00\n Notebook     | Stationery  |   150.00\n(2 rows)",
 "tx_setup": "CREATE TABLE\nINSERT 0 3",
 "tx_commit": "BEGIN\nUPDATE 1\nUPDATE 1\nCOMMIT\n account_id |   holder   | balance\n------------+------------+----------\n          1 | Ali Khan   | 40000.00\n          2 | Ayesha Rao | 40000.00\n          3 | Ravi Kumar | 10000.00\n(3 rows)",
 "tx_rollback": "BEGIN\nUPDATE 1\n account_id | balance\n------------+----------\n          1 | 35000.00\n(1 row)\n\nROLLBACK\n account_id | balance\n------------+----------\n          1 | 40000.00\n(1 row)",
 "tx_ddl": "BEGIN\nCREATE TABLE\nROLLBACK\nERROR:  relation \"temp_experiment\" does not exist\nLINE 1: SELECT * FROM temp_experiment;\n                      ^",
 "tx_savepoint": "BEGIN\nUPDATE 1\nSAVEPOINT\nUPDATE 1\n balance\n---------\n    0.00\n(1 row)\n\nROLLBACK\n balance\n----------\n 11000.00\n(1 row)\n\nCOMMIT",
 "tx_error": "BEGIN\nERROR:  new row for relation \"accounts\" violates check constraint \"accounts_balance_check\"\nDETAIL:  Failing row contains (3, Ravi Kumar, -88999.00).\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nROLLBACK",
 "tx_transfer": "BEGIN\nUPDATE 1\nUPDATE 1\nCOMMIT\n account_id |   holder   | balance\n------------+------------+----------\n          1 | Ali Khan   | 40000.00\n          2 | Ayesha Rao | 38000.00\n          3 | Ravi Kumar | 13000.00\n(3 rows)\n\n total_money_in_bank\n---------------------\n            91000.00\n(1 row)",
 "tx_transfer_fail": "BEGIN\nERROR:  new row for relation \"accounts\" violates check constraint \"accounts_balance_check\"\nDETAIL:  Failing row contains (3, Ravi Kumar, -37000.00).\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nCOMMIT\n account_id | balance\n------------+----------\n          1 | 40000.00\n          2 | 38000.00\n          3 | 13000.00\n(3 rows)",
 "tg_table": "CREATE TABLE",
 "tg_func": "CREATE FUNCTION",
 "tg_create": "CREATE TRIGGER",
 "tg_test": "UPDATE 2\n audit_id | emp_id | old_salary | new_salary | changed_by\n----------+--------+------------+------------+------------\n        1 |    101 |   55000.00 |   60000.00 | postgres\n        2 |    105 |   48000.00 |   53000.00 | postgres\n(2 rows)",
 "tg_before": "CREATE FUNCTION\nCREATE TRIGGER",
 "tg_before_test": "ERROR:  Salary cut not allowed for employee 101: 60000.00 -> 40000.00\nCONTEXT:  PL/pgSQL function prevent_salary_cut() line 4 at RAISE",
 "tg_clean": "CREATE FUNCTION\nCREATE TRIGGER\n emp_id | emp_name\n--------+-----------\n    109 | Mohan Das\n(1 row)\n\nINSERT 0 1",
 "tg_list": "      trigger_name      | event  | timing | level\n------------------------+--------+--------+-------\n trg_prevent_salary_cut | UPDATE | BEFORE | ROW\n trg_salary_audit       | UPDATE | AFTER  | ROW\n trg_tidy_name          | INSERT | BEFORE | ROW\n(3 rows)",
 "tg_disable": "ALTER TABLE\nUPDATE 1\nALTER TABLE",
 "tg_drop": "DROP TRIGGER\nDROP TRIGGER\nDROP FUNCTION",
 "ix_setup": "SELECT 100000\nALTER TABLE\nANALYZE\n rows_in_table\n---------------\n        100000\n(1 row)",
 "ix_explain1": "                          QUERY PLAN\n---------------------------------------------------------------\n Seq Scan on big_orders  (cost=0.00..1890.00 rows=20 width=17)\n   Filter: (customer_id = 1234)\n(2 rows)",
 "ix_create": "CREATE INDEX\nANALYZE",
 "ix_explain2": "                                    QUERY PLAN\n-----------------------------------------------------------------------------------\n Bitmap Heap Scan on big_orders  (cost=4.45..74.09 rows=20 width=17)\n   Recheck Cond: (customer_id = 1234)\n   ->  Bitmap Index Scan on idx_orders_customer  (cost=0.00..4.44 rows=20 width=0)\n         Index Cond: (customer_id = 1234)\n(4 rows)",
 "ix_pk": "                                    QUERY PLAN\n-----------------------------------------------------------------------------------\n Index Scan using big_orders_pkey on big_orders  (cost=0.29..8.31 rows=1 width=17)\n   Index Cond: (order_id = 500)\n(2 rows)",
 "ix_unique": "CREATE TABLE\nCREATE INDEX\nINSERT 0 1\nERROR:  duplicate key value violates unique constraint \"uq_members_email\"\nDETAIL:  Key (email)=(ali@example.com) already exists.",
 "ix_composite": "CREATE INDEX\nANALYZE\n                                    QUERY PLAN\n-----------------------------------------------------------------------------------\n Bitmap Heap Scan on big_orders  (cost=4.42..47.67 rows=12 width=17)\n   Recheck Cond: ((customer_id = 1234) AND (order_date >= '2025-06-01'::date))\n   ->  Bitmap Index Scan on idx_cust_date  (cost=0.00..4.41 rows=12 width=0)\n         Index Cond: ((customer_id = 1234) AND (order_date >= '2025-06-01'::date))\n(4 rows)",
 "ix_size": " table_size | one_index_size\n------------+----------------\n 5120 kB    | 776 kB\n(1 row)",
 "ix_list": "      indexname      |                                       indexdef\n---------------------+---------------------------------------------------------------------------------------\n big_orders_pkey     | CREATE UNIQUE INDEX big_orders_pkey ON public.big_orders USING btree (order_id)\n idx_cust_date       | CREATE INDEX idx_cust_date ON public.big_orders USING btree (customer_id, order_date)\n idx_orders_customer | CREATE INDEX idx_orders_customer ON public.big_orders USING btree (customer_id)\n(3 rows)",
 "ix_drop": "DROP INDEX\nDROP INDEX",
 "sec_create": "CREATE ROLE\nCREATE ROLE\nCREATE ROLE",
 "sec_roles": "    rolname     | can_login | superuser\n----------------+-----------+-----------\n analyst        | t         | f\n intern         | t         | f\n readonly_group | f         | f\n(3 rows)",
 "sec_alter": "ALTER ROLE\nALTER ROLE\nALTER ROLE\nALTER ROLE",
 "sec_grant": "GRANT\nGRANT\nGRANT\nGRANT",
 "sec_test": "SET\n  emp_name   |   city\n-------------+-----------\n Ali Khan    | Hyderabad\n Ayesha Rao  | Hyderabad\n John Mathew | Bengaluru\n(3 rows)\n\nERROR:  permission denied for table employees\nERROR:  permission denied for table employees\nRESET",
 "sec_revoke": "REVOKE\nREVOKE",
 "sec_show": "    grantee     | privilege_type\n----------------+----------------\n analyst        | SELECT\n readonly_group | SELECT\n(2 rows)",
 "sec_drop1": "ERROR:  role \"trainee\" cannot be dropped because some objects depend on it\nDETAIL:  privileges for column emp_name of table employees\nprivileges for column city of table employees",
 "sec_drop2": "DROP OWNED\nDROP ROLE\nDROP OWNED\nDROP ROLE",
 "ai_select": " product_name |  price\n--------------+----------\n Laptop       | 55000.00\n Mobile       | 20000.00\n(2 rows)",
 "ai_join": " customer_name | total_spent\n---------------+-------------\n Ayesha Rao    |    75750.00\n Ali Khan      |    61000.00\n John Mathew   |     3000.00\n(3 rows)",
 "ai_sub": " customer_name\n---------------\n Priya Sharma\n(1 row)",
 "ai_agg": "   month    | orders | revenue\n------------+--------+----------\n 2026-01-01 |      2 | 81000.00\n 2026-02-01 |      1 |  1900.00\n 2026-03-01 |      2 | 58750.00\n(3 rows)",
 "ai_err1": "ERROR:  syntax error at or near \"3\"\nLINE 1: SELECT TOP 3 product_name, price FROM products ORDER BY price DESC;\n                   ^",
 "ai_err2": "ERROR:  function ifnull(numeric, integer) does not exist\nLINE 1: SELECT product_name, IFNULL(price, 0) FROM products;\n                             ^\nHINT:  No function matches the given name and argument types. You might need to add explicit type casts.",
 "ai_bug": " rows_returned\n---------------\n            30\n(1 row)",
 "ai_fix": " rows_returned\n---------------\n             6\n(1 row)",
 "ai_verify": " delivered_revenue\n-------------------\n         139750.00\n(1 row)",
 "p1_tables": "CREATE TABLE\nCREATE TABLE",
 "p1_insert_dept": "INSERT 0 4",
 "p1_insert_students": "INSERT 0 8",
 "p1_update": " student_id | student_name |   city    | gpa\n------------+--------------+-----------+------\n          7 | Karan Mehta  | Bengaluru | 7.40\n(1 row)\n\nUPDATE 1",
 "p1_update2": "UPDATE 1",
 "p1_delete": " student_id |  student_name\n------------+----------------\n          8 | Sara Fernandes\n(1 row)\n\nDELETE 1",
 "p1_fk": "ERROR:  update or delete on table \"departments\" violates foreign key constraint \"students_dept_id_fkey\" on table \"students\"\nDETAIL:  Key (dept_id)=(1) is still referenced from table \"students\".",
 "p1_q1": " student_name |   city    | gpa\n--------------+-----------+------\n Ayesha Rao   | Hyderabad | 9.10\n Ali Khan     | Hyderabad | 8.40\n Meena Iyer   | Chennai   | 7.20\n(3 rows)",
 "p1_q2": " student_name | gpa\n--------------+------\n Priya Sharma | 9.40\n Ayesha Rao   | 9.10\n John Mathew  | 8.80\n(3 rows)",
 "p1_q3": " student_name |   city    | gpa  | age\n--------------+-----------+------+-----\n Ali Khan     | Hyderabad | 8.40 |  21\n Ayesha Rao   | Hyderabad | 9.10 |  22\n John Mathew  | Chennai   | 8.80 |  22\n(3 rows)",
 "p1_q4": " student_name |       email\n--------------+-------------------\n Ali Khan     | ali@college.edu\n Karan Mehta  | karan@college.edu\n(2 rows)",
 "p1_r1": "     dept_name      | students | avg_gpa | best_gpa\n--------------------+----------+---------+----------\n Computer Science   |        3 |    8.23 |     9.10\n Business Analytics |        2 |    9.10 |     9.40\n Electronics        |        2 |    7.50 |     7.60\n Mechanical         |        0 |         |\n(4 rows)",
 "p1_r2": " admission_year | admitted\n----------------+----------\n           2021 |        1\n           2022 |        2\n           2023 |        4\n(3 rows)",
 "p1_r3": "     dept_name      | avg_gpa\n--------------------+---------\n Business Analytics |    9.10\n(1 row)",
 "p2_insert": " emp_id |   emp_name   |  salary\n--------+--------------+----------\n    109 | Nisha Verma  | 72000.00\n    110 | Imran Sheikh | 58000.00\n    111 | Deepa Nair   | 51000.00\n(3 rows)\n\nINSERT 0 3",
 "p2_q1": "  emp_name   |  salary\n-------------+----------\n Meena Iyer  | 82000.00\n Ravi Kumar  | 75000.00\n Nisha Verma | 72000.00\n(3 rows)",
 "p2_q2": "    emp_name    | hire_date\n----------------+------------\n Deepa Nair     | 2024-08-20\n Imran Sheikh   | 2024-04-15\n Nisha Verma    | 2024-02-01\n Karan Mehta    | 2023-06-01\n Sara Fernandes | 2023-01-10\n(5 rows)",
 "p2_q3": "  emp_name   | commission\n-------------+------------\n Deepa Nair  |\n John Mathew |\n Meena Iyer  |\n(3 rows)",
 "p2_agg": "   department    | headcount |  payroll  | avg_salary |  lowest  | highest\n-----------------+-----------+-----------+------------+----------+----------\n IT              |         4 | 297000.00 |   74250.00 | 68000.00 | 82000.00\n Sales           |         4 | 220000.00 |   55000.00 | 45000.00 | 62000.00\n HR              |         2 |  99000.00 |   49500.00 | 48000.00 | 51000.00\n (no department) |         1 |  52000.00 |   52000.00 | 52000.00 | 52000.00\n(4 rows)",
 "p2_city": "   city    | employees | total_pay\n-----------+-----------+-----------\n Hyderabad |         4 | 237000.00\n Bengaluru |         3 | 215000.00\n Mumbai    |         3 | 151000.00\n(3 rows)",
 "p2_j1": "   emp_name   | dept_name | location\n--------------+-----------+----------\n Priya Sharma | HR        | Mumbai\n Deepa Nair   | HR        | Mumbai\n(2 rows)",
 "p2_j2": "    emp_name    | department\n----------------+------------\n Sara Fernandes | Unassigned\n(1 row)",
 "p2_j3": " dept_name\n-----------\n Finance\n(1 row)",
 "p2_j4": "    employee    |      manager\n----------------+--------------------\n Ali Khan       | (top of the chart)\n Ayesha Rao     | Ali Khan\n Ravi Kumar     | Ali Khan\n John Mathew    | Ravi Kumar\n Priya Sharma   | Ali Khan\n Meena Iyer     | Ravi Kumar\n Karan Mehta    | Ayesha Rao\n Sara Fernandes | Priya Sharma\n Nisha Verma    | Ravi Kumar\n Imran Sheikh   | Ayesha Rao\n Deepa Nair     | (top of the chart)\n(11 rows)",
 "p2_j5": "   manager    | direct_reports\n--------------+----------------\n Ali Khan     |              3\n Ravi Kumar   |              3\n Ayesha Rao   |              2\n Priya Sharma |              1\n(4 rows)",
 "p2_above": "   emp_name   | dept_name |  salary\n--------------+-----------+----------\n Deepa Nair   | HR        | 51000.00\n Meena Iyer   | IT        | 82000.00\n Ravi Kumar   | IT        | 75000.00\n Ayesha Rao   | Sales     | 62000.00\n Imran Sheikh | Sales     | 58000.00\n(5 rows)",
 "p2_above2": "   emp_name   | dept_name |  salary  | avg_salary | above_average_by\n--------------+-----------+----------+------------+------------------\n Meena Iyer   | IT        | 82000.00 |   74250.00 |          7750.00\n Ayesha Rao   | Sales     | 62000.00 |   55000.00 |          7000.00\n Imran Sheikh | Sales     | 58000.00 |   55000.00 |          3000.00\n Deepa Nair   | HR        | 51000.00 |   49500.00 |          1500.00\n Ravi Kumar   | IT        | 75000.00 |   74250.00 |           750.00\n(5 rows)",
 "p3_import": "INSERT 0 4\nINSERT 0 7",
 "p3_check": " orders | order_lines\n--------+-------------\n     10 |          16\n(1 row)",
 "p3_view": "CREATE VIEW",
 "p3_total": " orders | units_sold |  revenue\n--------+------------+-----------\n      9 |        118 | 244650.00\n(1 row)",
 "p3_aov": " average_order_value\n---------------------\n            27183.33\n(1 row)",
 "p3_cat": "  category   | units |  revenue\n-------------+-------+-----------\n Electronics |    11 | 223000.00\n Furniture   |     2 |  15000.00\n Stationery  |   105 |   6650.00\n(3 rows)",
 "p3_top_units": " product_name | units_sold\n--------------+------------\n Pen          |         70\n Notebook     |         35\n Headphones   |          6\n(3 rows)",
 "p3_top_rev": " product_name |  revenue\n--------------+-----------\n Laptop       | 165000.00\n Mobile       |  40000.00\n Headphones   |  18000.00\n(3 rows)",
 "p3_month": "   month    | orders | revenue\n------------+--------+----------\n 2026-01-01 |      2 | 81000.00\n 2026-02-01 |      1 |  1900.00\n 2026-03-01 |      2 | 58750.00\n 2026-04-01 |      3 | 93000.00\n 2026-05-01 |      1 | 10000.00\n(5 rows)",
 "p3_growth": "   month    | revenue  | growth_pct\n------------+----------+------------\n 2026-01-01 | 81000.00 |\n 2026-02-01 |  1900.00 |      -97.7\n 2026-03-01 | 58750.00 |     2992.1\n 2026-04-01 | 93000.00 |       58.3\n 2026-05-01 | 10000.00 |      -89.2\n(5 rows)",
 "p3_cust": " customer_name |  spent\n---------------+----------\n Ayesha Rao    | 85750.00\n Ali Khan      | 77900.00\n Ravi Kumar    | 55000.00\n(3 rows)",
 "p3_never": " customer_name\n---------------\n(0 rows)",
 "p3_open": " order_id | customer_name |  status   |  value\n----------+---------------+-----------+----------\n     1003 | Ali Khan      | Shipped   |  1900.00\n     1004 | Ravi Kumar    | Cancelled |  7500.00\n     1009 | Ali Khan      | Shipped   | 15000.00\n(3 rows)",
 "p3_index": "CREATE INDEX\nCREATE INDEX\nCREATE INDEX\nCREATE INDEX",
 "p3_index_list": "  tablename  |      indexname\n-------------+---------------------\n order_items | idx_items_order\n order_items | idx_items_product\n orders      | idx_orders_customer\n orders      | idx_orders_date\n(4 rows)",
 "p4_raw": "CREATE TABLE\nINSERT 0 13",
 "p4_profile": " rows_total | distinct_transactions | missing_quantity | invalid_quantity | missing_discount\n------------+-----------------------+------------------+------------------+------------------\n         13 |                    12 |                1 |                1 |                4\n(1 row)",
 "p4_regions": " region | rows\n--------+------\n NORTH  |    1\n North  |    3\n South  |    4\n West   |    3\n south  |    1\n west   |    1\n(6 rows)",
 "p4_dups": " txn_id | copies\n--------+--------\n   1005 |      2\n(1 row)",
 "p4_clean": "SELECT 10\nALTER TABLE",
 "p4_rejects": "SELECT 2\n txn_id | customer_name  | quantity |        reason\n--------+----------------+----------+-----------------------\n   1008 | Sara Fernandes |          | missing quantity\n   1010 | Meena Iyer     |       -1 | quantity not positive\n(2 rows)",
 "p4_verify": " raw_rows | clean_rows | rejected_rows | distinct_txn\n----------+------------+---------------+--------------\n       13 |         10 |             2 |           12\n(1 row)",
 "p4_regions2": " region | rows\n--------+------\n North  |    3\n South  |    5\n West   |    2\n(3 rows)",
 "p4_kpi": " transactions | units | gross_revenue | net_revenue | discounts_given | avg_transaction_value\n--------------+-------+---------------+-------------+-----------------+-----------------------\n           10 |    46 |     187150.00 |   180450.00 |         6700.00 |              18045.00\n(1 row)",
 "p4_region": " region | transactions | net_revenue | share_pct\n--------+--------------+-------------+-----------\n South  |            5 |   160250.00 |      88.8\n North  |            3 |    17100.00 |       9.5\n West   |            2 |     3100.00 |       1.7\n(3 rows)",
 "p4_cat": "  category   | units | net_revenue | avg_discount_pct\n-------------+-------+-------------+------------------\n Electronics |     8 |   155300.00 |              6.0\n Furniture   |     3 |    22500.00 |              0.0\n Stationery  |    35 |     2650.00 |              0.0\n(3 rows)",
 "p4_cust": " customer_name | orders |  spent   |  segment\n---------------+--------+----------+------------\n Ayesha Rao    |      2 | 92250.00 | High value\n Ali Khan      |      3 | 68000.00 | High value\n John Mathew   |      2 |  9600.00 | Low\n Ravi Kumar    |      1 |  7500.00 | Low\n Priya Sharma  |      1 |  2700.00 | Low\n Karan Mehta   |      1 |   400.00 | Low\n(6 rows)",
 "p4_repeat": " repeat_customers | all_customers | repeat_rate_pct\n------------------+---------------+-----------------\n                3 |             6 |            50.0\n(1 row)",
 "p4_reps": "  sales_rep  | deals | net_revenue | avg_discount_pct | revenue_rank\n-------------+-------+-------------+------------------+--------------\n Ravi Kumar  |     5 |   160250.00 |              2.0 |            1\n Meena Iyer  |     3 |    17100.00 |              3.3 |            2\n John Mathew |     2 |     3100.00 |              5.0 |            3\n(3 rows)",
 "p4_trend": "  month  | transactions | net_revenue\n---------+--------------+-------------\n 2026-01 |            3 |    99750.00\n 2026-02 |            4 |    19600.00\n 2026-03 |            3 |    61100.00\n(3 rows)",
 "iv_q1": "  salary\n----------\n 75000.00\n(1 row)",
 "iv_q2": "    emp_name\n----------------\n Sara Fernandes\n(1 row)",
 "iv_q3": " dept_name | employees\n-----------+-----------\n IT        |         3\n Sales     |         3\n(2 rows)",
 "iv_q4": " dept_id |   emp_name   |  salary\n---------+--------------+----------\n      10 | Ayesha Rao   | 62000.00\n      20 | Priya Sharma | 48000.00\n      30 | Meena Iyer   | 82000.00\n(3 rows)",
 "iv_q5a": "CREATE TABLE\nINSERT 0 5\n      email      | copies\n-----------------+--------\n ali@example.com |      3\n(1 row)",
 "iv_q5b": "DELETE 2\n id |  name  |       email\n----+--------+--------------------\n  1 | Ali    | ali@example.com\n  2 | Ayesha | ayesha@example.com\n  4 | Ravi   | ravi@example.com\n(3 rows)",
 "iv_q6": "    emp_name    |  salary  |   manager    | manager_salary\n----------------+----------+--------------+----------------\n Ayesha Rao     | 62000.00 | Ali Khan     |       55000.00\n Ravi Kumar     | 75000.00 | Ali Khan     |       55000.00\n Meena Iyer     | 82000.00 | Ravi Kumar   |       75000.00\n Sara Fernandes | 52000.00 | Priya Sharma |       48000.00\n(4 rows)",
 "iv_q7": " customer_name\n---------------\n Ayesha Rao\n(1 row)",
 "iv_q8": " customer_name | delivered | shipped | cancelled\n---------------+-----------+---------+-----------\n Ali Khan      |         1 |       1 |         0\n Ayesha Rao    |         2 |       0 |         0\n John Mathew   |         1 |       0 |         0\n Ravi Kumar    |         0 |       0 |         1\n(4 rows)",
 "iv_req": " customer_name | orders | revenue\n---------------+--------+----------\n Ayesha Rao    |      2 | 75750.00\n Ali Khan      |      1 | 61000.00\n(2 rows)"
};


/* =========================================================================
   MODULE 1 — Database fundamentals and environment setup
   ========================================================================= */

//# db: intro emp
topic("introduction", "Introduction to Databases", "Beginner",
  "Data vs information, what a database is and why we need one, types of databases, DBMS vs RDBMS, and the five categories of SQL commands.",
  "fa-solid fa-database", "Introduction to Databases", "Where data lives, and how SQL talks to it",
  () => `
    ${section("1", "What is Data? What is Information?",
      p("<strong>Data</strong> is a collection of raw facts: numbers, text, dates or images that have no meaning on their own. <strong>Information</strong> is data that has been processed, organised and placed in context, so that it helps someone make a decision.") +
      table(["", "Data", "Information"], [
        ["Meaning", "Raw, unprocessed facts", "Processed, meaningful data"],
        ["Example", c("55000") + ", " + c("62000") + ", " + c("48000"), "“The average salary in the Sales department is ₹58,500”"],
        ["Usefulness", "Hard to use on its own", "Supports decisions"],
        ["Business view", "Every sale, click, payment", "Monthly revenue report, top customers"],
      ]) +
      callout("fa-solid fa-lightbulb", "<p><strong>Takeaway:</strong> a database stores <em>data</em>; SQL is the tool that turns that data into <em>information</em>.</p>")
    )}

    ${section("2", "What is a Database? Why do we need one?",
      p("A <strong>database</strong> is an organised collection of related data, stored electronically so that it can be accessed, managed and updated easily. Think of it as a very smart, multi-user filing cabinet.") +
      p("Before databases, organisations kept data in paper files or separate spreadsheets. That caused real problems:") +
      split("Problems with files / spreadsheets", [
        "<strong>Duplicate data</strong> – the same customer typed in five places.",
        "<strong>Inconsistency</strong> – the phone number differs between two files.",
        "<strong>No security</strong> – anyone with the file can see or change everything.",
        "<strong>Hard to search</strong> – finding “all orders above ₹10,000 last March” takes hours.",
        "<strong>No safe sharing</strong> – two people editing the same file overwrite each other.",
      ], "What a database gives us", [
        "<strong>One copy of the truth</strong> – data stored once, used everywhere.",
        "<strong>Integrity</strong> – rules (constraints) keep the data valid.",
        "<strong>Security</strong> – users get only the permissions they need.",
        "<strong>Fast retrieval</strong> – ask a question in SQL, get the answer in milliseconds.",
        "<strong>Concurrency and recovery</strong> – many users at once, with backups and transactions.",
      ])
    )}

    ${section("3", "Real-World Applications of Databases",
      chips([
        ["fa-solid fa-building-columns", "Banking – accounts, transactions"],
        ["fa-solid fa-cart-shopping", "E-commerce – products, orders, payments"],
        ["fa-solid fa-hospital", "Hospitals – patients, prescriptions"],
        ["fa-solid fa-plane", "Airlines – flights, bookings, seats"],
        ["fa-solid fa-graduation-cap", "Education – students, marks, attendance"],
        ["fa-solid fa-people-group", "Social media – profiles, posts, likes"],
        ["fa-solid fa-truck-fast", "Logistics – shipments, tracking"],
        ["fa-solid fa-chart-line", "Business analytics – sales, KPIs"],
      ]) +
      real("every dashboard a Business Analyst builds (Power BI, Tableau, Excel reports) is fed by a database query. Knowing SQL means you can fetch the data yourself instead of waiting for someone else to export it.")
    )}

    ${section("4", "Types of Databases",
      table(["Type", "How data is organised", "Examples", "Typical use"], [
        ["<strong>Relational</strong>", "Tables made of rows and columns, linked by keys", "PostgreSQL, MySQL, Oracle, SQL Server", "Banking, ERP, e-commerce, analytics"],
        ["<strong>NoSQL</strong>", "Documents, key-value pairs, wide columns or graphs (flexible schema)", "MongoDB, Redis, Cassandra, Neo4j", "Real-time apps, caching, big unstructured data"],
        ["<strong>Hierarchical</strong>", "A tree: each record has one parent and many children", "IBM IMS, the Windows Registry", "Organisation charts, file systems"],
        ["<strong>Network</strong>", "A graph: a record can have many parents and many children", "IDMS, Integrated Data Store", "Older telecom and manufacturing systems"],
      ]) +
      fig("sql_database_types.png", "Four database types drawn side by side: relational tables, a NoSQL document, a hierarchical tree and a network graph") +
      callout("fa-solid fa-circle-info", "<p>This course uses a <strong>relational</strong> database, because most business data is structured and related (customers → orders → products).</p>")
    )}

    ${section("5", "DBMS and RDBMS",
      p("A <strong>DBMS</strong> (Database Management System) is the software that creates, stores, protects and retrieves the data in a database. You never touch the data files directly; you talk to the DBMS, and it does the work. An <strong>RDBMS</strong> is a DBMS that stores data in related tables.") +
      sub("6", "Difference between DBMS and RDBMS") +
      table(["Aspect", "DBMS", "RDBMS"], [
        ["Data storage", "Files, trees or other formats", "Tables (rows and columns)"],
        ["Relationships", "Usually no relationship between data items", "Tables are linked with primary and foreign keys"],
        ["Normalisation", "Not supported", "Supported"],
        ["Data integrity", "Few or no rules", "Constraints enforce valid data"],
        ["Multiple users", "Often single user", "Multi-user, with transactions"],
        ["Examples", "File-based systems, early XML stores", "PostgreSQL, MySQL, Oracle, SQL Server"],
      ])
    )}

    ${section("7", "Introduction to SQL",
      p("<strong>SQL</strong> (Structured Query Language, pronounced “S-Q-L” or “sequel”) is the standard language for talking to relational databases. You describe <em>what</em> you want, and the database works out <em>how</em> to get it.") +
      bullets([
        "1970 – E. F. Codd at IBM publishes the relational model of data.",
        "1970s – IBM builds SEQUEL, later renamed SQL, to query relational data.",
        "1986–1987 – SQL becomes an ANSI and then ISO standard, and has been revised many times since.",
      ]) +
      p("Read a simple query almost like English:") +
      ex("intro_q1", `SELECT dept_name, location
FROM departments
WHERE location = 'Hyderabad';`) +
      p("“Show me the department name and location from the departments table, where the location is Hyderabad.”")
    )}

    ${section("8", "SQL vs PostgreSQL",
      table(["", "SQL", "PostgreSQL"], [
        ["What is it?", "A <strong>language</strong> (a standard)", "A <strong>software product</strong> (an RDBMS)"],
        ["Role", "Describes what data you want", "Stores the data and executes your SQL"],
        ["Owner", "ISO / ANSI standard", "Open-source, community-developed"],
        ["Analogy", "English", "A person who understands English and answers you"],
      ]) +
      p("Every RDBMS understands SQL, but each adds its own extras (“dialects”): T-SQL in SQL Server, PL/SQL in Oracle, and PL/pgSQL plus rich data types such as JSONB in PostgreSQL. The core you learn in this course works almost everywhere.") +
      callout("fa-solid fa-circle-check", "<p><strong>Why PostgreSQL?</strong> It is free and open source, closely follows the SQL standard, is very reliable, and is widely used in industry for analytics and web applications.</p>")
    )}

    ${section("9", "Categories of SQL Commands",
      table(["Category", "Full name", "Purpose", "Commands"], [
        ["<strong>DDL</strong>", "Data Definition Language", "Create and change the <em>structure</em> of objects", c("CREATE") + ", " + c("ALTER") + ", " + c("DROP") + ", " + c("TRUNCATE")],
        ["<strong>DML</strong>", "Data Manipulation Language", "Add, change and remove the <em>data</em>", c("INSERT") + ", " + c("UPDATE") + ", " + c("DELETE")],
        ["<strong>DQL</strong>", "Data Query Language", "Read / retrieve data", c("SELECT")],
        ["<strong>DCL</strong>", "Data Control Language", "Control who can do what (permissions)", c("GRANT") + ", " + c("REVOKE")],
        ["<strong>TCL</strong>", "Transaction Control Language", "Save or undo groups of changes", c("COMMIT") + ", " + c("ROLLBACK") + ", " + c("SAVEPOINT")],
      ]) +
      fig("sql_command_categories.png", "The five categories of SQL commands: DDL, DML, DQL, DCL and TCL with their main commands") +
      note("Memory trick:", "DDL builds the <em>house</em> (structure), DML moves the <em>furniture</em> (data), DQL <em>looks</em> at the rooms, DCL hands out the <em>keys</em>, and TCL decides whether to <em>save or undo</em> the changes.") +
      note("Textbook note:", "many books list <code>SELECT</code> under DML. This course follows the common modern grouping and treats it separately as DQL.")
    )}

    ${section("", "Where we are going",
      p("The following topics follow the same order: set up PostgreSQL → create databases and tables (DDL) → insert, update and delete data (DML) → query data (DQL) → functions, joins and subqueries → transactions, triggers, performance and security → projects.")
    )}
  `);

//# db: setup emp
topic("setup", "PostgreSQL Environment Setup", "Beginner",
  "Install PostgreSQL, meet pgAdmin and psql, connect to the server, run your first queries, save scripts and read error messages.",
  "fa-solid fa-server", "PostgreSQL Environment Setup", "Installing, connecting and running your first query",
  () => `
    ${section("1", "Introduction to PostgreSQL",
      p("PostgreSQL (often just “Postgres”) is a powerful open-source object-relational database system with more than 30 years of active development. It runs on Windows, macOS and Linux.") +
      chips([
        ["fa-solid fa-lock-open", "Free and open source"],
        ["fa-solid fa-shield-halved", "ACID compliant and very reliable"],
        ["fa-solid fa-list-check", "Follows the SQL standard closely"],
        ["fa-solid fa-code", "JSON / JSONB, arrays, UUID, full-text search"],
        ["fa-solid fa-puzzle-piece", "Extensions (PostGIS, pgcrypto …)"],
        ["fa-solid fa-gears", "Triggers and PL/pgSQL functions"],
      ])
    )}

    ${section("2", "Installing PostgreSQL",
      numlist("", [
        ["Download", "from <code>postgresql.org/download</code>. Windows and macOS users normally use the graphical installer from EDB; the package bundles the server, <strong>pgAdmin 4</strong> and <strong>psql</strong>."],
        ["Run the installer", "keep the default components (PostgreSQL Server, pgAdmin 4, Command Line Tools)."],
        ["Set a password", "for the default superuser called <code>postgres</code>. <strong>Remember it</strong>: you need it every time you connect."],
        ["Keep the default port", "<code>5432</code> is the standard PostgreSQL port."],
        ["Finish", "and open pgAdmin 4 from the Start menu / Applications. It asks for a “master password” the first time; that only protects pgAdmin itself."],
      ]) +
      table(["Operating system", "Quick alternative"], [
        ["Windows", "EDB graphical installer (recommended for class)"],
        ["macOS", "EDB installer, Postgres.app, or " + c("brew install postgresql")],
        ["Ubuntu / Debian", c("sudo apt install postgresql postgresql-contrib")],
      ]) +
      warn("write down the <code>postgres</code> password during installation. If you forget it, it can be reset, but that is an avoidable detour in class.")
    )}

    ${section("3", "PostgreSQL Server and Client",
      p("PostgreSQL works on a <strong>client–server</strong> model. The <strong>server</strong> is a background program that owns the data and executes SQL. A <strong>client</strong> is any program that sends SQL to the server and shows the answer.") +
      fig("sql_client_server.png", "Client-server model: pgAdmin, psql and an application connect over port 5432 to the PostgreSQL server that owns the databases") +
      table(["", "Server", "Client"], [
        ["What", "<code>postgres</code> service running in the background", "pgAdmin, psql, Python, Power BI, Excel …"],
        ["Job", "Stores data, runs queries, enforces rules", "Sends SQL, displays results"],
        ["Where", "Same laptop or a remote machine", "Anywhere that can reach the server"],
      ])
    )}

    ${section("4", "pgAdmin: the graphical client",
      p("pgAdmin 4 is the official graphical tool for PostgreSQL. It opens in your browser or as a desktop app. On the left, the <strong>Object Explorer</strong> shows everything the server holds:") +
      codeBlock("Object Explorer tree", `Servers
 └─ PostgreSQL
     └─ Databases
         └─ postgres
             └─ Schemas
                 └─ public
                     ├─ Tables
                     ├─ Views
                     └─ Functions`, "fa-solid fa-sitemap") +
      bullets([
        "<strong>Query Tool</strong> – right-click a database → <em>Query Tool</em>. Type SQL, press <strong>F5</strong> (or the ▶ button) to run it.",
        "<strong>Data Output</strong> – the grid under the editor shows the result rows; the <em>Messages</em> tab shows errors and notices.",
        "<strong>View/Edit Data</strong> – right-click a table → <em>View/Edit Data → All Rows</em> shows a table like a spreadsheet.",
        "<strong>Refresh</strong> – after you create something with SQL, right-click the parent node → <em>Refresh</em> to see it in the tree.",
      ])
    )}

    ${section("5", "psql: the command-line client",
      p("<code>psql</code> is the text-based client. It is fast, scriptable, and available on every server, so it is the tool you will meet on real projects.") +
      sh("Start psql from a terminal", `psql -h localhost -p 5432 -U postgres -d postgres`) +
      p("Commands that start with a backslash are <strong>psql meta-commands</strong>. They are not SQL; psql understands them itself and they need no semicolon.") +
      table(["Command", "What it does"], [
        [c("\\l"), "List all databases"],
        [c("\\c dbname"), "Connect to another database"],
        [c("\\dt"), "List tables in the current schema"],
        [c("\\d tablename"), "Describe a table (columns, types, constraints)"],
        [c("\\dn"), "List schemas"],
        [c("\\du"), "List roles (users)"],
        [c("\\i file.sql"), "Run the SQL commands saved in a file"],
        [c("\\conninfo"), "Show who and where you are connected"],
        [c("\\timing"), "Turn on / off the execution time display"],
        [c("\\x"), "Switch expanded (vertical) display on / off"],
        [c("\\?") + " / " + c("\\h CREATE TABLE"), "Help for psql / help for an SQL command"],
        [c("\\q"), "Quit psql"],
      ]) +
      tip("end every SQL statement with a semicolon <code>;</code>. If psql shows a prompt like <code>postgres-#</code> instead of <code>postgres=#</code>, it is still waiting for the semicolon.")
    )}

    ${section("6", "Connecting to the PostgreSQL Server",
      p("Every client needs the same five details:") +
      table(["Detail", "Default / typical value"], [
        ["Host", c("localhost") + " (this computer)"],
        ["Port", c("5432")],
        ["Database", c("postgres") + " (the default database)"],
        ["Username", c("postgres") + " (the superuser)"],
        ["Password", "the one you set during installation"],
      ]) +
      fig("sql_pgadmin_connect.png", "pgAdmin Register Server dialog showing the Connection tab with host, port, database, username and password") +
      numlist("", [
        ["In pgAdmin", "right-click <em>Servers → Register → Server…</em>, give it a name, fill in the <em>Connection</em> tab with the details above, and click <em>Save</em>. Double-click the server and enter the password."],
        ["In psql", "run the <code>psql</code> command shown earlier and type the password when asked (nothing appears while you type; that is normal)."],
      ])
    )}

    ${section("7", "Executing SQL queries",
      p("Your first queries do not even need a table. PostgreSQL can calculate and report on itself:") +
      ex("setup_q1", `SELECT 'Hello, SQL!' AS greeting;`) +
      ex("setup_q2", `SELECT 10 + 5 AS total, 10 * 5 AS product;`) +
      ex("setup_q3", `SELECT current_database(), current_user;`) +
      p("Now run a query on the sample data (the script to build it is in the next topics):") +
      ex("setup_q4", `SELECT emp_name, salary
FROM employees
WHERE dept_id = 30;`) +
      note("Case:", "SQL keywords are not case sensitive (<code>select</code> = <code>SELECT</code>). Convention: write keywords in UPPER CASE and names in lower_case so queries are easy to read.")
    )}

    ${section("8", "Saving and executing SQL scripts",
      p("A <strong>script</strong> is a text file (extension <code>.sql</code>) holding one or many SQL statements. Scripts make your work repeatable: the same file builds the same tables on any machine.") +
      codeBlock("create_tables.sql", `-- create_tables.sql : builds the practice tables
CREATE TABLE departments (
    dept_id   INTEGER PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

INSERT INTO departments VALUES (10, 'Sales'), (20, 'HR');

SELECT * FROM departments;`) +
      table(["Where", "How to run a script"], [
        ["pgAdmin", "Query Tool → <em>Open File</em> icon → choose the <code>.sql</code> file → F5. Use <em>Save File</em> to save your own scripts."],
        ["psql (inside)", c("\\i /full/path/create_tables.sql") + "  (use forward slashes, even on Windows)"],
        ["psql (terminal)", c("psql -U postgres -d mydb -f create_tables.sql")],
      ]) +
      bullets([
        "<code>-- comment</code> ignores the rest of the line; <code>/* ... */</code> comments out a block.",
        "pgAdmin runs <em>everything</em> in the editor on F5. To run only part, select it first.",
      ])
    )}

    ${section("9", "Understanding error messages",
      p("Errors are normal; even experts see them all day. PostgreSQL error messages are precise: read the <strong>first line</strong>, then look at the <code>LINE</code> and caret <code>^</code> showing where the problem was found.") +
      sub("", "Misspelled keyword") +
      ex("err_syntax", `SELEC * FROM departments;`) +
      sub("", "Table that does not exist") +
      ex("err_table", `SELECT * FROM department;`) +
      sub("", "Column that does not exist") +
      ex("err_column", `SELECT emp_nme FROM employees;`) +
      sub("", "Missing comma: no error, but a wrong result!") +
      ex("err_comma", `SELECT emp_name salary FROM employees LIMIT 1;`) +
      p("This is <em>valid</em> SQL: without the comma, PostgreSQL reads <code>salary</code> as an <strong>alias</strong> for <code>emp_name</code>. The column is renamed and the salary is never selected. Always check the column headings of your result.") +
      sub("", "Duplicate primary key") +
      ex("err_dup", `INSERT INTO departments VALUES (10, 'Marketing', 'Delhi');`) +
      table(["Message starts with", "Usually means", "What to check"], [
        [c("syntax error at or near"), "SQL grammar is wrong", "Spelling of keywords, commas, brackets, quotes"],
        [c("relation \"x\" does not exist"), "No such table (or wrong schema)", "Spelling, correct database, schema name"],
        [c("column \"x\" does not exist"), "No such column", "Spelling; text values need single quotes, not double"],
        [c("duplicate key value violates unique constraint"), "Primary key / unique value already exists", "Choose a new value"],
        [c("null value in column … violates not-null constraint"), "Required column left empty", "Provide a value"],
        [c("permission denied"), "Your role lacks the privilege", "Ask the owner for GRANT"],
      ]) +
      tip("an error inside a long script stops <em>that statement</em> only; the lines before it have already run. In psql, add <code>\\set ON_ERROR_STOP on</code> to stop the whole script at the first error.")
    )}
  `);

/* =========================================================================
   MODULE 2 — Database and table management (DDL)
   CREATE DATABASE / DROP DATABASE cannot run inside a transaction or on the
   practice engine used to capture outputs, so those outputs use exo() with the
   exact text psql prints.
   ========================================================================= */

//# db: dbmgmt
topic("database-management", "Database Creation and Management", "Beginner",
  "Database vs schema vs table, CREATE / ALTER / DROP DATABASE, connecting with pgAdmin and psql, ownership, backup and restore.",
  "fa-solid fa-database", "Database Creation and Management", "Create, connect to, rename and drop a database",
  () => `
    ${section("3.1", "Understanding a Database",
      p("A <strong>database</strong> is a container that holds all the related objects of one project: schemas, tables, views, functions and more. One PostgreSQL <em>server</em> (cluster) can host many independent databases.") +
      sub("", "Database vs Schema vs Table") +
      table(["Level", "What it is", "Analogy", "Example"], [
        ["Server (cluster)", "One running PostgreSQL installation", "A building", "localhost:5432"],
        ["<strong>Database</strong>", "A separate, isolated collection of data", "A floor of the building", c("company_db")],
        ["<strong>Schema</strong>", "A named folder of objects inside a database", "A room on the floor", c("public") + ", " + c("sales")],
        ["<strong>Table</strong>", "Rows and columns that hold the data", "A filing cabinet in the room", c("sales.orders")],
      ]) +
      fig("sql_db_schema_table.png", "Hierarchy diagram: PostgreSQL server contains databases, each database contains schemas, each schema contains tables, and each table has rows and columns") +
      sub("", "PostgreSQL structure to remember") +
      bullets([
        "Initial databases: <code>postgres</code> (default, for you), <code>template1</code> and <code>template0</code> (templates used when creating new databases).",
        "You are connected to <strong>one database at a time</strong>. A query cannot read a table from another database directly.",
        "Every new database starts with a schema called <code>public</code>.",
      ]) +
      sub("", "Naming conventions") +
      bullets([
        "Use <code>lower_case_with_underscores</code>: <code>sales_db</code>, <code>student_management</code>.",
        "Start with a letter or underscore; use letters, digits and underscores only; at most 63 characters.",
        "Unquoted names are folded to lower case. <code>CREATE DATABASE SalesDB</code> creates <code>salesdb</code>. Avoid quoted names like <code>&quot;SalesDB&quot;</code> because you would have to quote them forever.",
        "Do not use reserved words (<code>user</code>, <code>table</code>, <code>order</code>) as names.",
      ])
    )}

    ${section("3.2", "Creating a Database",
      sub("", "CREATE DATABASE: purpose and syntax") +
      exn("db_syntax", `CREATE DATABASE database_name
    [ OWNER = role_name ]
    [ ENCODING = 'UTF8' ]
    [ TEMPLATE = template0 ]
    [ CONNECTION LIMIT = number ];`, "Syntax") +
      sub("", "Creating a database using SQL") +
      exo("db_create", `CREATE DATABASE company_db;`, `CREATE DATABASE`) +
      sub("", "Creating a database with extra options") +
      exo("db_create_opts", `CREATE DATABASE sales_db
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = 20;`, `CREATE DATABASE`) +
      table(["Option", "Meaning"], [
        [c("OWNER"), "The role that owns the database (default: the role running the command)"],
        [c("ENCODING"), c("UTF8") + " stores every language and symbol, including ₹ and Hindi / Telugu text"],
        [c("TEMPLATE"), "The database to copy from (default " + c("template1") + ")"],
        [c("CONNECTION LIMIT"), "Maximum simultaneous connections (-1 = unlimited)"],
      ]) +
      sub("", "Creating a database using pgAdmin") +
      numlist("", [
        ["Right-click", "<em>Databases → Create → Database…</em>"],
        ["General tab", "type the <em>Database</em> name and choose the <em>Owner</em>."],
        ["Definition tab", "check Encoding = <code>UTF8</code> (optional)."],
        ["Save", "then right-click <em>Databases → Refresh</em> to see it."],
      ]) +
      fig("sql_pgadmin_create_db.png", "pgAdmin Create Database dialog with the General tab showing name and owner fields")
    )}

    ${section("3.3", "Connecting to a Database",
      table(["Tool", "How to connect"], [
        ["pgAdmin", "Click the database in the tree (it connects automatically), then open <em>Tools → Query Tool</em>."],
        ["psql at start", c("psql -U postgres -d company_db")],
        ["psql after start", c("\\c company_db") + " (short for " + c("\\connect") + ")"],
      ]) +
      sh("psql session", `postgres=# \\c company_db
You are now connected to database "company_db" as user "postgres".
company_db=# \\conninfo`) +
      p("Notice the prompt: the text before <code>=#</code> is the <strong>current database</strong>. To check it with SQL:") +
      ex("db_current", `SELECT current_database();`) +
      note("Remember:", "in pgAdmin each Query Tool tab is bound to one database. To work in another database, open a new Query Tool from that database.")
    )}

    ${section("3.4", "Managing an Existing Database",
      sub("", "Listing and checking databases") +
      sh("psql", `\\l                       -- list databases
SELECT current_database(); -- which one am I in?`) +
      exo("db_list", `SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;`, `  datname
------------
 company_db
 postgres
 sales_db
(3 rows)`, "SQL (list databases with SQL)") +
      sub("", "Renaming a database") +
      exo("db_rename", `ALTER DATABASE company_db RENAME TO company_data;`, `ALTER DATABASE`) +
      sub("", "Changing properties and ownership") +
      exo("db_alter", `ALTER DATABASE company_data OWNER TO analyst;
ALTER DATABASE company_data CONNECTION LIMIT 50;`, `ALTER DATABASE
ALTER DATABASE`) +
      sub("", "Dropping a database") +
      exo("db_drop", `DROP DATABASE company_data;
DROP DATABASE IF EXISTS company_data;   -- no error if it is already gone`, `DROP DATABASE
NOTICE:  database "company_data" does not exist, skipping
DROP DATABASE`) +
      callout("fa-solid fa-circle-question", "<p><strong><code>IF EXISTS</code> / <code>IF NOT EXISTS</code>:</strong> makes a script safe to run more than once. <code>DROP DATABASE IF EXISTS x</code> shows a harmless notice instead of an error when <code>x</code> is missing.</p>") +
      warn("<code>DROP DATABASE</code> is permanent and removes <em>all</em> its tables and data. There is no undo. Take a backup first.") +
      sub("", "Important practical knowledge: active connections") +
      p("A database <strong>cannot be renamed or dropped while anyone (including you) is connected to it</strong>. You will see:") +
      exo("db_active_err", `DROP DATABASE company_data;`, `ERROR:  database "company_data" is being accessed by other users
DETAIL:  There is 1 other session using the database.`) +
      p("The fix: connect to a <em>different</em> database (for example <code>postgres</code>) and close the other sessions first.") +
      exn("db_terminate", `-- 1. connect to another database:   \\c postgres
-- 2. see who is connected
SELECT pid, usename, application_name
FROM pg_stat_activity
WHERE datname = 'company_data';

-- 3. disconnect them (needs superuser or the same role)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'company_data' AND pid <> pg_backend_pid();

-- 4. now the rename / drop works
DROP DATABASE company_data;`) +
      sub("", "Database backup and restoration (overview)") +
      table(["Task", "Command (run in a normal terminal, not inside psql)"], [
        ["Backup one database to a SQL file", c("pg_dump -U postgres -d company_data -f company_data.sql")],
        ["Backup in compressed custom format", c("pg_dump -U postgres -Fc -d company_data -f company_data.dump")],
        ["Restore a SQL file", c("psql -U postgres -d new_db -f company_data.sql")],
        ["Restore a custom-format dump", c("pg_restore -U postgres -d new_db company_data.dump")],
      ]) +
      p("In pgAdmin the same tools are available: right-click the database → <em>Backup…</em> or <em>Restore…</em>.") +
      sub("", "Database permissions and ownership") +
      bullets([
        "The <strong>owner</strong> can alter and drop the database. Superusers can do anything.",
        "<code>CONNECT</code> privilege decides who may connect; <code>CREATE</code> decides who may create schemas inside it.",
        "Permissions are covered in detail in the Database Security topic.",
      ])
    )}
  `);

//# db: schema emp
topic("schema-management", "Schema Management", "Beginner",
  "What schemas are and why we use them, CREATE / ALTER / DROP SCHEMA, search_path, tables inside schemas, CASCADE vs RESTRICT.",
  "fa-solid fa-folder-tree", "Schema Management", "Folders inside a database that keep objects organised",
  () => `
    ${section("1", "What is a Schema? Why do we need schemas?",
      p("A <strong>schema</strong> is a named namespace inside a database. It groups tables, views, functions and other objects, like folders group files.") +
      bullets([
        "<strong>Organisation</strong> – keep <code>sales</code>, <code>hr</code> and <code>finance</code> tables apart in one database.",
        "<strong>No name clashes</strong> – <code>sales.customers</code> and <code>support.customers</code> can both exist.",
        "<strong>Security</strong> – give a team access to one schema only.",
        "<strong>Cleaner work</strong> – staging, reporting and raw-data areas in the same database.",
      ]) +
      sub("", "Database vs Schema") +
      table(["", "Database", "Schema"], [
        ["Level", "Top-level container", "Lives <em>inside</em> a database"],
        ["Cross-access", "Cannot query another database directly", "Can query another schema with " + c("schema.table")],
        ["Default", c("postgres"), c("public")],
        ["Created with", c("CREATE DATABASE"), c("CREATE SCHEMA")],
      ])
    )}

    ${section("2", "CREATE SCHEMA and viewing schemas",
      exn("sch_syntax", `CREATE SCHEMA [IF NOT EXISTS] schema_name [AUTHORIZATION role_name];`, "Syntax") +
      ex("sch_create", `CREATE SCHEMA sales;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS hr;`) +
      p("The third command shows a harmless notice because <code>hr</code> already exists. List the schemas:") +
      ex("sch_list", `SELECT schema_name
FROM information_schema.schemata
WHERE schema_name NOT LIKE 'pg\\_%' AND schema_name <> 'information_schema'
ORDER BY schema_name;`) +
      sh("psql", `\\dn      -- list schemas`)
    )}

    ${section("3", "Creating tables inside a schema",
      p("Prefix the table name with the schema: <code>schema_name.table_name</code>. Without a prefix PostgreSQL uses the <code>search_path</code> (next section), which starts with <code>public</code>.") +
      ex("sch_tables", `CREATE TABLE sales.customers (
    customer_id   INTEGER PRIMARY KEY,
    customer_name VARCHAR(40) NOT NULL
);

CREATE TABLE hr.customers (          -- same table name, different schema: allowed
    staff_id   INTEGER PRIMARY KEY,
    staff_name VARCHAR(40)
);

INSERT INTO sales.customers VALUES (1, 'Ali Khan'), (2, 'Ayesha Rao');
SELECT * FROM sales.customers;`) +
      p("Every table that you create without a schema lands in <code>public</code>. Check where tables live:") +
      ex("sch_where", `SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN ('customers', 'employees')
ORDER BY table_schema, table_name;`)
    )}

    ${section("4", "The search_path",
      p("<code>search_path</code> is the ordered list of schemas PostgreSQL searches when you write a table name <em>without</em> a schema. The default is <code>&quot;$user&quot;, public</code>.") +
      exo("sch_sp1", `SHOW search_path;`, ` search_path
-----------------
 "$user", public
(1 row)`) +
      p("Unqualified names are looked up in order. Because <code>sales</code> is not on the path yet, this fails:") +
      ex("sch_sp2", `SELECT * FROM customers;`) +
      ex("sch_sp3", `SET search_path TO sales, public;
SELECT * FROM customers;`) +
      bullets([
        "<code>SET search_path</code> lasts for the current session only.",
        "To make it permanent for a database: <code>ALTER DATABASE dbname SET search_path TO sales, public;</code>",
        "New tables are created in the <strong>first</strong> schema on the path.",
      ]) +
      tip("in shared code and scripts, prefer the explicit <code>schema.table</code> form. It cannot be fooled by someone else’s <code>search_path</code>.")
    )}

    ${section("5", "ALTER SCHEMA: rename and change ownership",
      ex("sch_alter", `ALTER SCHEMA hr RENAME TO human_resources;
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'human_resources';`) +
      exn("sch_owner", `ALTER SCHEMA sales OWNER TO analyst;`, "Change ownership")
    )}

    ${section("6", "DROP SCHEMA: CASCADE vs RESTRICT",
      p("A schema that still contains tables cannot be dropped by default; that default is <code>RESTRICT</code>. <code>CASCADE</code> drops the schema <em>and everything inside it</em>.") +
      table(["Option", "Behaviour"], [
        [c("RESTRICT") + " (default)", "Refuses to drop if the schema contains any object"],
        [c("CASCADE"), "Also drops all tables, views and other objects inside, and objects that depend on them"],
        [c("IF EXISTS"), "No error when the schema does not exist"],
      ]) +
      ex("sch_drop1", `DROP SCHEMA sales;`) +
      ex("sch_drop2", `RESET search_path;
DROP SCHEMA sales CASCADE;
DROP SCHEMA IF EXISTS human_resources CASCADE;
DROP SCHEMA IF EXISTS sales;`) +
      warn("<code>CASCADE</code> is powerful and silent about the data it deletes. Use it on practice schemas, and think twice on production.")
    )}
  `);

/* =========================================================================
   MODULE 2 (continued) — Table creation and management
   ========================================================================= */

//# db: types
topic("tables-datatypes", "Tables and SQL Data Types", "Beginner",
  "What a table is (rows, columns, records, fields), how keys connect tables, and the numeric, text, date/time, boolean and other data types of PostgreSQL.",
  "fa-solid fa-table-list", "Tables and Data Types", "The structure that holds data, and the type of every column",
  () => `
    ${section("5.1", "Understanding Tables",
      p("A <strong>table</strong> is where data actually lives. It is a grid: every <strong>column</strong> describes one property, and every <strong>row</strong> describes one thing (one student, one order, one payment).") +
      fig("sql_table_anatomy.png", "A table named employees with labelled parts: table name, columns (fields), a row (record), and a cell value") +
      table(["Everyday word", "Database word", "Meaning"], [
        ["Table", "Relation / entity", "A collection of similar things, e.g. " + c("employees")],
        ["Row", "Record / tuple", "One complete item, e.g. one employee"],
        ["Column", "Field / attribute", "One property of every row, e.g. " + c("salary")],
        ["Cell", "Value", "One piece of data, e.g. " + c("55000")],
      ]) +
      sub("", "Table structure") +
      p("The <strong>structure</strong> (also called the <em>schema</em> or <em>definition</em>) of a table is its list of columns, with a data type and optional rules for each. The structure is fixed first; then rows are added.") +
      sub("", "Primary Key and Foreign Key: introduction") +
      bullets([
        "<strong>Primary key (PK)</strong> – a column (or set of columns) whose value <em>uniquely identifies each row</em>. It can never be empty or repeated. Example: " + c("dept_id") + " in " + c("departments") + ".",
        "<strong>Foreign key (FK)</strong> – a column that holds the primary-key value of <em>another</em> table, creating a link. Example: " + c("employees.dept_id") + " points to " + c("departments.dept_id") + ".",
      ]) +
      table(["dept_id (PK)", "dept_name", "location"], [["10", "Sales", "Hyderabad"], ["20", "HR", "Mumbai"], ["30", "IT", "Bengaluru"]]) +
      table(["emp_id (PK)", "emp_name", "dept_id (FK)"], [["101", "Ali Khan", "10"], ["103", "Ravi Kumar", "30"], ["105", "Priya Sharma", "20"]]) +
      callout("fa-solid fa-link", "<p>Ravi’s row stores only the number <code>30</code>, not the text “IT, Bengaluru”. The department details are stored <strong>once</strong>, in <code>departments</code>, and a join (later topic) brings them together on demand.</p>")
    )}

    ${section("5.2", "SQL Data Types",
      p("Every column has a <strong>data type</strong> that decides what values are allowed, how much space they use, and which operations make sense. Choosing the right type is the first step in a good design.") +
      sub("1", "Numeric data types") +
      table(["Type", "Storage", "Range / precision", "Typical use"], [
        [c("SMALLINT"), "2 bytes", "−32,768 to 32,767", "Ratings, small counters"],
        [c("INTEGER") + " (" + c("INT") + ")", "4 bytes", "about ±2.1 billion", "IDs, quantities, ages"],
        [c("BIGINT"), "8 bytes", "about ±9.2 × 10<sup>18</sup>", "Very large counters and IDs"],
        [c("DECIMAL(p,s)") + " / " + c("NUMERIC(p,s)"), "variable", "<strong>Exact</strong>; p = total digits, s = digits after the point", "Money, prices, percentages"],
        [c("REAL"), "4 bytes", "≈ 6 digits, <em>approximate</em>", "Scientific measurements"],
        [c("DOUBLE PRECISION"), "8 bytes", "≈ 15 digits, <em>approximate</em>", "Scientific calculations"],
      ]) +
      p("<code>NUMERIC(10,2)</code> means up to 10 digits in total with 2 after the decimal point: the largest value is <code>99999999.99</code>. <code>DECIMAL</code> and <code>NUMERIC</code> are the same type in PostgreSQL.") +
      ex("dt_float", `SELECT 0.1::double precision + 0.2::double precision AS float_sum,
       0.1::numeric          + 0.2::numeric          AS exact_sum;`) +
      callout("fa-solid fa-triangle-exclamation", "<p><strong>Never store money in <code>REAL</code> or <code>DOUBLE PRECISION</code>.</strong> They are binary approximations and produce results like <code>0.30000000000000004</code>. Use <code>NUMERIC</code>.</p>") +
      ex("dt_intdiv", `SELECT 10 / 3 AS int_division, 10 / 3.0 AS decimal_division, 10 % 3 AS remainder;`) +
      ex("dt_overflow", `SELECT 2147483647 + 1;`) +
      p("The second query is an overflow: both numbers are <code>INTEGER</code> and the result does not fit. Use <code>BIGINT</code> (<code>2147483647::bigint + 1</code>) when values may grow past 2.1 billion.") +

      sub("2", "Character data types") +
      table(["Type", "Behaviour", "Use for"], [
        [c("CHAR(n)"), "Fixed length. Shorter values are padded with spaces up to n.", "Codes of constant length: state code " + c("TS") + ", grade " + c("A")],
        [c("VARCHAR(n)"), "Variable length, rejects text longer than n.", "Names, emails, cities"],
        [c("TEXT"), "Variable length, no limit.", "Descriptions, comments, addresses"],
      ]) +
      ex("dt_char", `SELECT 'ab'::char(5)    AS char_value,
       octet_length('ab'::char(5))    AS char_bytes,
       octet_length('ab'::varchar(5)) AS varchar_bytes;`) +
      ex("dt_toolong", `CREATE TABLE city_demo (code VARCHAR(5));
INSERT INTO city_demo VALUES ('HYD');
INSERT INTO city_demo VALUES ('Hyderabad');`) +
      tip("in PostgreSQL, <code>VARCHAR(n)</code> and <code>TEXT</code> perform equally well. The <code>(n)</code> is only a validation rule. Use <code>VARCHAR(n)</code> when a real maximum exists, otherwise <code>TEXT</code>.") +

      sub("3", "Date and time data types") +
      table(["Type", "Stores", "Example value"], [
        [c("DATE"), "Calendar date only", c("2026-11-05")],
        [c("TIME"), "Time of day only", c("14:30:00")],
        [c("TIMESTAMP"), "Date and time, <em>without</em> time zone", c("2026-11-05 14:30:00")],
        [c("TIMESTAMPTZ"), "Date and time <em>with</em> time zone (stored in UTC, shown in your session time zone)", c("2026-11-05 14:30:00+05:30")],
      ]) +
      ex("dt_dates", `SET TIME ZONE 'Asia/Kolkata';
SELECT DATE '2026-11-05'                          AS d,
       TIME '14:30:00'                            AS t,
       TIMESTAMP '2026-11-05 14:30:00'            AS ts,
       TIMESTAMPTZ '2026-11-05 14:30:00+05:30'    AS tstz;`) +
      tip("use <code>DATE</code> for birthdays, hire dates and order dates; use <code>TIMESTAMPTZ</code> for events that happen at an exact moment (payment time, login time).") +

      sub("4", "Boolean data type") +
      p("<code>BOOLEAN</code> holds <code>TRUE</code>, <code>FALSE</code> or <code>NULL</code> (unknown). PostgreSQL also accepts <code>'t'</code>, <code>'yes'</code>, <code>'on'</code>, <code>'1'</code> for true and <code>'f'</code>, <code>'no'</code>, <code>'off'</code>, <code>'0'</code> for false.") +
      ex("dt_bool", `SELECT TRUE AS a, 'yes'::boolean AS b, '0'::boolean AS c, (5 > 3) AS d;`) +
      p("psql prints booleans as <code>t</code> and <code>f</code>; pgAdmin shows <code>true</code> and <code>false</code>.") +

      sub("5", "Other useful types") +
      table(["Type", "Purpose", "Example"], [
        [c("UUID"), "Universally unique identifier, good for IDs created by many systems", c("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")],
        [c("JSON"), "JSON stored as plain text (keeps formatting)", c("'{\"city\":\"Hyderabad\"}'")],
        [c("JSONB"), "JSON stored in binary form: faster to search, can be indexed (preferred)", c("'{\"skills\":[\"SQL\",\"Python\"]}'")],
        [c("BYTEA"), "Binary data (small files, hashes)", c("'\\xDEADBEEF'")],
      ]) +
      ex("dt_other", `SELECT '{"name":"Ali","skills":["SQL","Python"]}'::jsonb ->> 'name'  AS name,
       '{"name":"Ali","skills":["SQL","Python"]}'::jsonb -> 'skills' ->> 0 AS first_skill,
       'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid AS id;`) +

      sub("6", "Choosing appropriate data types") +
      table(["Data", "Good choice", "Why"], [
        ["Primary-key ID", c("INTEGER") + " / " + c("BIGINT") + " identity", "Compact and fast to compare"],
        ["Price, salary, balance", c("NUMERIC(10,2)"), "Exact decimals"],
        ["Quantity, age", c("INTEGER") + " or " + c("SMALLINT"), "Whole numbers"],
        ["Name, city, email", c("VARCHAR(n)") + " or " + c("TEXT"), "Variable text"],
        ["Phone number, PIN code, Aadhaar", c("VARCHAR") + " / " + c("TEXT"), "Not used for maths; leading zeros and + must be kept"],
        ["Date of joining", c("DATE"), "Enables date arithmetic and sorting"],
        ["Yes / no flag", c("BOOLEAN"), "Clear, tiny"],
      ]) +
      warn("do not store dates as text (<code>'05-11-2026'</code>): they sort alphabetically, cannot be validated and cannot be used in date functions.")
    )}
  `);

//# db: create emp
topic("create-table", "Creating Tables", "Beginner",
  "CREATE TABLE syntax, simple and multi-column tables, choosing data types, adding constraints, auto-numbering IDs, copying a structure with LIKE and building tables with CREATE TABLE AS.",
  "fa-solid fa-table", "Creating Tables", "From an idea to a real table with CREATE TABLE",
  () => `
    ${section("5.3", "CREATE TABLE: purpose and syntax",
      exn("ct_syntax", `CREATE TABLE [IF NOT EXISTS] table_name (
    column1  data_type  [column_constraint ...],
    column2  data_type  [column_constraint ...],
    ...
    [table_constraint ...]
);`, "Syntax") +
      bullets([
        "A table needs a <strong>name</strong> and at least one <strong>column</strong>; each column has a name and a data type.",
        "Columns are separated by commas. <strong>No comma after the last column.</strong>",
        "<code>IF NOT EXISTS</code> avoids an error if the table is already there.",
      ])
    )}

    ${section("1", "Creating a simple table",
      ex("ct_simple", `CREATE TABLE students (
    student_id    INTEGER,
    student_name  VARCHAR(50),
    age           INTEGER
);`) +
      p("Look at what PostgreSQL stored for the table:") +
      ex("ct_describe", `SELECT column_name, data_type, character_maximum_length AS max_len, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;`) +
      sh("psql equivalent", `\\d students`) +
      p("The new table is empty. A first row, and a query to read it:") +
      ex("ct_first_row", `INSERT INTO students VALUES (1, 'Ali', 20);
SELECT * FROM students;`)
    )}

    ${section("2", "A table with multiple columns and appropriate data types",
      p("A realistic product table: every column has a type chosen for the data it will hold.") +
      ex("ct_multi", `CREATE TABLE inventory (
    product_id    INTEGER,
    product_name  VARCHAR(60),
    category      VARCHAR(30),
    unit_price    NUMERIC(10,2),     -- exact money
    stock_qty     INTEGER,           -- whole number
    is_active     BOOLEAN,           -- yes / no
    added_on      DATE,              -- calendar date
    added_at      TIMESTAMPTZ        -- exact moment
);`) +
      ex("ct_multi_ins", `INSERT INTO inventory VALUES
    (1, 'Laptop', 'Electronics', 55000.00, 12, TRUE, '2026-10-01', '2026-10-01 10:15:00+05:30');
SELECT product_name, unit_price, is_active, added_on FROM inventory;`)
    )}

    ${section("3", "A table with constraints",
      p("<strong>Constraints</strong> are rules the database enforces automatically. They are covered in full in the Constraints topic; here is a first look in <code>CREATE TABLE</code>:") +
      ex("ct_constraints", `CREATE TABLE courses (
    course_id    INTEGER        PRIMARY KEY,
    course_name  VARCHAR(50)    NOT NULL UNIQUE,
    fee          NUMERIC(8,2)   CHECK (fee >= 0),
    duration     INTEGER        DEFAULT 30        -- days
);`) +
      ex("ct_constraints_ins", `INSERT INTO courses (course_id, course_name, fee) VALUES (1, 'SQL Basics', 4999);
SELECT * FROM courses;`) +
      p("The <code>duration</code> column was not supplied, so the <code>DEFAULT</code> value <code>30</code> was used. A rule violation is stopped at once:") +
      ex("ct_constraints_err", `INSERT INTO courses (course_id, course_name, fee) VALUES (2, 'Python', -100);`)
    )}

    ${section("4", "Auto-numbering IDs: identity columns",
      p("Typing every ID by hand is error-prone. An <strong>identity column</strong> makes PostgreSQL generate 1, 2, 3 … for you:") +
      ex("ct_identity", `CREATE TABLE trainers (
    trainer_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainer_name  VARCHAR(40) NOT NULL
);

INSERT INTO trainers (trainer_name) VALUES ('Ravi'), ('Meena'), ('John');
SELECT * FROM trainers;`) +
      table(["Option", "Meaning"], [
        [c("GENERATED ALWAYS AS IDENTITY"), "Database always generates the value; manual values are rejected (unless forced). Recommended."],
        [c("GENERATED BY DEFAULT AS IDENTITY"), "Database generates it unless you supply your own value."],
        [c("SERIAL"), "Older shorthand that does the same job; you will see it in many tutorials and old projects."],
      ])
    )}

    ${section("5", "Creating a table from another table's structure (LIKE)",
      p("<code>LIKE</code> copies the column names and types (and, with <code>INCLUDING ALL</code>, defaults, constraints and indexes) but <strong>no rows</strong>.") +
      ex("ct_like", `CREATE TABLE employees_archive (LIKE employees INCLUDING ALL);

SELECT count(*) AS rows_in_archive FROM employees_archive;`)
    )}

    ${section("6", "Creating a table from a query (CREATE TABLE AS)",
      p("<code>CREATE TABLE ... AS SELECT</code> creates a table and fills it with the query result in one step: great for snapshots, reports and test data.") +
      ex("ct_ctas", `CREATE TABLE high_earners AS
SELECT emp_id, emp_name, salary
FROM employees
WHERE salary > 60000;

SELECT * FROM high_earners ORDER BY emp_id;`) +
      callout("fa-solid fa-circle-info", "<p><code>CREATE TABLE AS</code> copies column names, types and data, but <strong>not</strong> primary keys, defaults or other constraints. Use <code>LIKE ... INCLUDING ALL</code> when you need the full structure.</p>") +
      table(["", "LIKE", "CREATE TABLE AS"], [
        ["Copies structure", "Yes (plus constraints, with INCLUDING ALL)", "Yes (column names and types only)"],
        ["Copies data", "No", "Yes (whatever the query returns)"],
        ["Typical use", "Empty archive / staging table", "Report snapshot, backup of selected rows"],
      ])
    )}

    ${section("", "Good table-design habits",
      bullets([
        "One table = one kind of thing (<code>customers</code>, <code>orders</code>). Do not mix them.",
        "Give every table a primary key.",
        "Use <code>lower_snake_case</code> names, and the same style everywhere (all plural, or all singular).",
        "Choose the smallest sensible type, but never use text for numbers or dates.",
        "Add <code>NOT NULL</code> to columns that must always have a value.",
      ])
    )}
  `);

//# db: alter
topic("alter-table", "Altering and Dropping Tables", "Intermediate",
  "View table structure, ALTER TABLE (add, change, rename, drop columns, defaults, NOT NULL), rename tables, DROP TABLE, TRUNCATE, and DROP vs TRUNCATE vs DELETE.",
  "fa-solid fa-screwdriver-wrench", "Altering and Dropping Tables", "Change the structure of a table without losing the data",
  () => `
    ${section("5.4", "Viewing table structure",
      p("We will work with a small <code>trainees</code> table through this topic.") +
      ex("al_setup", `CREATE TABLE trainees (
    trainee_id    INTEGER PRIMARY KEY,
    trainee_name  VARCHAR(30),
    score         INTEGER
);

INSERT INTO trainees VALUES (1, 'Ali', 85), (2, 'Ayesha', 92), (3, 'Ravi', 76);`) +
      table(["Task", "psql", "SQL (works in pgAdmin too)"], [
        ["List tables", c("\\dt"), c("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")],
        ["Describe a table (DESCRIBE in other databases)", c("\\d trainees"), c("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trainees';")],
      ]) +
      ex("al_list", `SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;`) +
      ex("al_desc", `SELECT column_name, data_type, character_maximum_length AS max_len, is_nullable
FROM information_schema.columns
WHERE table_name = 'trainees'
ORDER BY ordinal_position;`) +
      p("<code>\\d trainees</code> prints the same details in a compact form (shown here from the same table):") +
      exo("al_psql_d", `\\d trainees`, `                        Table "public.trainees"
    Column    |         Type          | Collation | Nullable | Default
--------------+-----------------------+-----------+----------+---------
 trainee_id   | integer               |           | not null |
 trainee_name | character varying(30) |           |          |
 score        | integer               |           |          |
Indexes:
    "trainees_pkey" PRIMARY KEY, btree (trainee_id)`, "psql")
    )}

    ${section("1", "ALTER TABLE: introduction",
      p("<code>ALTER TABLE</code> changes the <strong>structure</strong> of an existing table while keeping its data. Every change follows the same shape:") +
      exn("al_syntax", `ALTER TABLE table_name  action;     -- one action per clause`, "Syntax") +
      table(["Action", "Syntax"], [
        ["Add a column", c("ADD COLUMN col type")],
        ["Change data type", c("ALTER COLUMN col TYPE new_type [USING expr]")],
        ["Set / drop default", c("ALTER COLUMN col SET DEFAULT x") + " / " + c("DROP DEFAULT")],
        ["Set / drop NOT NULL", c("ALTER COLUMN col SET NOT NULL") + " / " + c("DROP NOT NULL")],
        ["Rename a column", c("RENAME COLUMN old TO new")],
        ["Drop a column", c("DROP COLUMN col")],
        ["Rename the table", c("RENAME TO new_name")],
        ["Change owner", c("OWNER TO role")],
      ])
    )}

    ${section("2", "Adding a column",
      ex("al_add", `ALTER TABLE trainees ADD COLUMN city VARCHAR(30);
SELECT * FROM trainees ORDER BY trainee_id;`) +
      p("Existing rows get <code>NULL</code> in a new column, unless you give a default:") +
      ex("al_add_default", `ALTER TABLE trainees ADD COLUMN status VARCHAR(10) DEFAULT 'active';
SELECT * FROM trainees ORDER BY trainee_id;`)
    )}

    ${section("3", "Changing a column's data type",
      ex("al_type", `ALTER TABLE trainees ALTER COLUMN score TYPE NUMERIC(5,2);
SELECT trainee_name, score FROM trainees ORDER BY trainee_id;`) +
      p("When PostgreSQL cannot convert the old values automatically, it asks for an explicit conversion with <code>USING</code>:") +
      ex("al_type_err", `ALTER TABLE trainees ADD COLUMN batch VARCHAR(10);
UPDATE trainees SET batch = '101';
ALTER TABLE trainees ALTER COLUMN batch TYPE INTEGER;`) +
      ex("al_type_using", `ALTER TABLE trainees ALTER COLUMN batch TYPE INTEGER USING batch::integer;
SELECT trainee_name, batch FROM trainees ORDER BY trainee_id;`) +
      warn("changing a type can rewrite the whole table and can lose information (for example, <code>NUMERIC</code> to <code>INTEGER</code> rounds decimals). Test on a copy first.")
    )}

    ${section("4", "Setting or removing a column's default value",
      ex("al_default", `ALTER TABLE trainees ALTER COLUMN status SET DEFAULT 'inactive';
INSERT INTO trainees (trainee_id, trainee_name) VALUES (4, 'John');
SELECT trainee_name, status FROM trainees ORDER BY trainee_id;`) +
      ex("al_default_drop", `ALTER TABLE trainees ALTER COLUMN status DROP DEFAULT;`) +
      p("A new default only affects <strong>future</strong> inserts; existing rows keep their values.")
    )}

    ${section("5", "Setting or removing NOT NULL",
      ex("al_nn_err", `ALTER TABLE trainees ALTER COLUMN city SET NOT NULL;`) +
      p("The column still has empty values, so the rule cannot be applied yet. Fix the data first:") +
      ex("al_nn_ok", `UPDATE trainees SET city = 'Hyderabad' WHERE city IS NULL;
ALTER TABLE trainees ALTER COLUMN city SET NOT NULL;`) +
      ex("al_nn_drop", `ALTER TABLE trainees ALTER COLUMN city DROP NOT NULL;`)
    )}

    ${section("6", "Renaming and dropping columns",
      ex("al_rename_col", `ALTER TABLE trainees RENAME COLUMN trainee_name TO full_name;
SELECT * FROM trainees ORDER BY trainee_id;`) +
      ex("al_drop_col", `ALTER TABLE trainees DROP COLUMN batch;
ALTER TABLE trainees DROP COLUMN status;
SELECT * FROM trainees ORDER BY trainee_id;`) +
      warn("<code>DROP COLUMN</code> deletes the column <em>and all its data</em> permanently.")
    )}

    ${section("7", "Renaming a table and changing its owner",
      ex("al_rename_tbl", `ALTER TABLE trainees RENAME TO learners;
SELECT count(*) AS rows_in_learners FROM learners;`) +
      exn("al_owner", `ALTER TABLE learners OWNER TO analyst;`, "Change ownership")
    )}

    ${section("8", "DROP TABLE and TRUNCATE TABLE",
      sub("", "DROP TABLE: remove the table completely") +
      ex("al_drop", `DROP TABLE learners;
DROP TABLE IF EXISTS learners;`) +
      p("<code>IF EXISTS</code> turns “table not found” into a harmless notice. If other tables point to it through a foreign key, use <code>DROP TABLE name CASCADE</code> (this drops the <em>foreign-key constraints</em>, not the other tables).") +
      sub("", "TRUNCATE TABLE: empty the table, keep the structure") +
      ex("al_trunc_setup", `CREATE TABLE ticket_log (
    ticket_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    note       VARCHAR(30)
);
INSERT INTO ticket_log (note) VALUES ('a'), ('b'), ('c');
DELETE FROM ticket_log;
INSERT INTO ticket_log (note) VALUES ('d');
SELECT * FROM ticket_log;`) +
      p("After <code>DELETE</code>, the next ID is <code>4</code>: the counter keeps going. <code>TRUNCATE</code> can reset it:") +
      ex("al_trunc", `TRUNCATE TABLE ticket_log RESTART IDENTITY;
INSERT INTO ticket_log (note) VALUES ('e');
SELECT * FROM ticket_log;`) +
      table(["Option", "Effect"], [
        [c("RESTART IDENTITY"), "Resets identity / serial counters to 1"],
        [c("CASCADE"), "Also truncates tables that have a foreign key to this one"],
      ])
    )}

    ${section("9", "DROP vs TRUNCATE vs DELETE",
      table(["", "DELETE", "TRUNCATE", "DROP"], [
        ["Category", "DML", "DDL", "DDL"],
        ["Removes", "Selected rows (or all rows)", "All rows", "The whole table: rows <em>and</em> structure"],
        ["WHERE clause", "Yes", "No", "No"],
        ["Table still exists afterwards", "Yes", "Yes", "<strong>No</strong>"],
        ["Speed on large tables", "Slowest (row by row)", "Very fast", "Very fast"],
        ["Identity counter reset", "No", "Only with " + c("RESTART IDENTITY"), "Table is gone"],
        ["Row-level triggers fire", "Yes", "No", "No"],
        ["Can be rolled back in PostgreSQL", "Yes", "Yes (inside a transaction)", "Yes (inside a transaction)"],
      ]) +
      callout("fa-solid fa-lightbulb", "<p><strong>Rule of thumb:</strong> remove <em>some</em> rows → <code>DELETE ... WHERE</code>. Empty a table but keep it → <code>TRUNCATE</code>. Get rid of the table itself → <code>DROP</code>. This comparison is a favourite interview question.</p>")
    )}
  `);

/* =========================================================================
   MODULE 2 (continued) — SQL constraints
   ========================================================================= */

//# db: cons
topic("constraints", "SQL Constraints", "Intermediate",
  "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT; composite keys, naming, adding and dropping constraints, referential integrity and ON DELETE actions.",
  "fa-solid fa-shield-halved", "SQL Constraints", "Rules that keep the data in your tables valid",
  () => `
    ${section("1", "What are constraints? Why are they required?",
      p("A <strong>constraint</strong> is a rule attached to a column or table. PostgreSQL checks it on every <code>INSERT</code> and <code>UPDATE</code> (and <code>DELETE</code> for foreign keys) and <strong>rejects any change that breaks the rule</strong>.") +
      bullets([
        "<strong>Data integrity</strong> – no salary of −500, no order for a customer who does not exist.",
        "<strong>Safety net</strong> – bugs in an application or a wrong CSV import cannot silently corrupt the data.",
        "<strong>Self-documenting</strong> – anyone reading the table definition sees the business rules.",
      ]) +
      table(["Constraint", "Rule it enforces"], [
        [c("NOT NULL"), "The column must always have a value"],
        [c("UNIQUE"), "No two rows may have the same value in the column(s)"],
        [c("PRIMARY KEY"), "Unique <em>and</em> not null; identifies each row"],
        [c("FOREIGN KEY"), "The value must exist in another table's key (referential integrity)"],
        [c("CHECK"), "The value must satisfy a condition"],
        [c("DEFAULT"), "Value used when none is supplied (strictly a column property, not a rule)"],
      ]) +
      callout("fa-solid fa-lightbulb", "<p><strong>Principle:</strong> enforce rules in the database, not only in the application. The database is the last line of defence and every program that touches it is protected.</p>")
    )}

    ${section("2", "NOT NULL",
      p("<code>NULL</code> means “unknown / missing”. <code>NOT NULL</code> forbids it.") +
      ex("cn_nn", `CREATE TABLE customers_demo (
    customer_id    INTEGER,
    customer_name  VARCHAR(40) NOT NULL,
    phone          VARCHAR(15)
);

INSERT INTO customers_demo VALUES (1, 'Ali Khan', '9876543210');
INSERT INTO customers_demo VALUES (2, NULL, '9123456780');
INSERT INTO customers_demo (customer_id, phone) VALUES (3, '9000000000');`) +
      p("The last statement fails too: leaving a column out means it gets its default, which is <code>NULL</code>.")
    )}

    ${section("3", "UNIQUE",
      p("<code>UNIQUE</code> makes sure no two rows share the same value. Use it for natural identifiers that are not the primary key: email, GST number, username.") +
      ex("cn_uq", `CREATE TABLE users_demo (
    user_id   INTEGER PRIMARY KEY,
    email     VARCHAR(60) UNIQUE,
    username  VARCHAR(30)
);

INSERT INTO users_demo VALUES (1, 'ali@example.com', 'ali'), (2, 'ayesha@example.com', 'ayesha');
INSERT INTO users_demo VALUES (3, 'ali@example.com', 'ali2');`) +
      p("Unlike a primary key, a unique column <strong>may contain <code>NULL</code></strong>, and NULLs are not considered equal to each other, so several rows can have an empty email:") +
      ex("cn_uq_null", `INSERT INTO users_demo VALUES (4, NULL, 'guest1'), (5, NULL, 'guest2');
SELECT * FROM users_demo ORDER BY user_id;`)
    )}

    ${section("4", "PRIMARY KEY",
      p("A primary key = <code>UNIQUE</code> + <code>NOT NULL</code>. A table can have <strong>only one</strong> primary key, and it identifies each row.") +
      ex("cn_pk", `CREATE TABLE dept_demo (
    dept_id    INTEGER PRIMARY KEY,
    dept_name  VARCHAR(30) NOT NULL
);

INSERT INTO dept_demo VALUES (10, 'Sales'), (20, 'HR');
INSERT INTO dept_demo VALUES (10, 'Marketing');
INSERT INTO dept_demo VALUES (NULL, 'Legal');`) +
      table(["", "PRIMARY KEY", "UNIQUE"], [
        ["Duplicates allowed?", "No", "No"],
        ["NULL allowed?", "No", "Yes (many NULLs allowed)"],
        ["How many per table?", "Only one", "As many as needed"],
        ["Purpose", "Identify the row; target of foreign keys", "Prevent duplicates in other columns"],
      ])
    )}

    ${section("5", "FOREIGN KEY",
      p("A <strong>foreign key</strong> links a column to the primary key (or unique column) of another table. It guarantees that every reference points to something that really exists.") +
      ex("cn_fk", `CREATE TABLE emp_demo (
    emp_id    INTEGER PRIMARY KEY,
    emp_name  VARCHAR(40) NOT NULL,
    dept_id   INTEGER REFERENCES dept_demo (dept_id)
);

INSERT INTO emp_demo VALUES (1, 'Ali', 10), (2, 'Ayesha', 20);
INSERT INTO emp_demo VALUES (3, 'Ravi', 99);`) +
      p("The foreign key also protects the <em>parent</em> table: you cannot delete a department that employees still point to.") +
      ex("cn_fk_parent", `DELETE FROM dept_demo WHERE dept_id = 10;`) +
      note("Good to know:", "a foreign-key column may be <code>NULL</code> (an employee not yet assigned to a department). The parent column must be a primary key or have a <code>UNIQUE</code> constraint.")
    )}

    ${section("6", "CHECK",
      p("<code>CHECK</code> validates a value with any condition you can write in SQL.") +
      ex("cn_ck", `CREATE TABLE payroll_demo (
    emp_id  INTEGER PRIMARY KEY,
    salary  NUMERIC(10,2) CHECK (salary > 0),
    age     INTEGER,
    CONSTRAINT chk_age CHECK (age BETWEEN 18 AND 65)
);

INSERT INTO payroll_demo VALUES (1, 50000, 30);
INSERT INTO payroll_demo VALUES (2, -5, 30);
INSERT INTO payroll_demo VALUES (3, 40000, 17);`) +
      p("A check can compare columns of the same row, e.g. <code>CHECK (end_date &gt;= start_date)</code>. It cannot look at other rows or other tables; use a foreign key or a trigger for that.")
    )}

    ${section("7", "DEFAULT",
      p("<code>DEFAULT</code> supplies a value whenever an <code>INSERT</code> leaves the column out (or uses the keyword <code>DEFAULT</code>).") +
      ex("cn_df", `CREATE TABLE tickets_demo (
    ticket_id  INTEGER PRIMARY KEY,
    subject    VARCHAR(60) NOT NULL,
    status     VARCHAR(10) NOT NULL DEFAULT 'open',
    priority   INTEGER     DEFAULT 3
);

INSERT INTO tickets_demo (ticket_id, subject) VALUES (1, 'Login problem');
INSERT INTO tickets_demo VALUES (2, 'Refund request', 'closed', DEFAULT);
SELECT * FROM tickets_demo ORDER BY ticket_id;`) +
      tip("useful defaults: <code>DEFAULT CURRENT_DATE</code> for a creation date, <code>DEFAULT CURRENT_TIMESTAMP</code> for an exact moment, <code>DEFAULT TRUE</code> for flags, <code>DEFAULT 0</code> for counters.")
    )}

    ${section("8", "Composite primary key",
      p("Sometimes no single column identifies a row, but a <strong>combination</strong> does. In a student–course enrolment, a student may join many courses and a course has many students, but each <em>pair</em> appears only once.") +
      ex("cn_cpk", `CREATE TABLE enrollments (
    student_id   INTEGER,
    course_id    INTEGER,
    enrolled_on  DATE,
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO enrollments VALUES (1, 101, '2026-06-01'), (1, 102, '2026-06-01'), (2, 101, '2026-06-03');
INSERT INTO enrollments VALUES (1, 101, '2026-07-01');`) +
      p("Student 1 may appear again, and course 101 may appear again, but never the same pair twice. A composite key must be written as a <em>table</em> constraint (after the columns).")
    )}

    ${section("9", "Naming, adding and removing constraints",
      sub("", "Naming constraints") +
      p("PostgreSQL gives every constraint a name. Without your input it builds one: <code>table_column_pkey</code> (primary key), <code>_key</code> (unique), <code>_check</code>, <code>_fkey</code>. Your own names, from <code>CONSTRAINT name ...</code>, make error messages and later changes much clearer (see <code>chk_age</code> above).") +
      sub("", "Adding constraints with ALTER TABLE") +
      ex("cn_alter", `CREATE TABLE vendors (
    vendor_id    INTEGER,
    vendor_name  VARCHAR(40),
    gst_no       VARCHAR(15),
    rating       INTEGER
);

ALTER TABLE vendors ADD CONSTRAINT pk_vendors        PRIMARY KEY (vendor_id);
ALTER TABLE vendors ADD CONSTRAINT uq_vendors_gst    UNIQUE (gst_no);
ALTER TABLE vendors ADD CONSTRAINT chk_vendors_rating CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE vendors ALTER COLUMN vendor_name SET NOT NULL;
ALTER TABLE vendors ALTER COLUMN rating SET DEFAULT 3;`) +
      p("List the constraints that now exist on the table (<code>p</code> = primary key, <code>u</code> = unique, <code>c</code> = check, <code>f</code> = foreign key):") +
      ex("cn_list", `SELECT conname AS constraint_name, contype AS type, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'vendors'::regclass AND contype IN ('p', 'u', 'c', 'f')
ORDER BY conname;`) +
      sh("psql", `\\d vendors      -- shows the same constraints under "Indexes:" and "Check constraints:"`) +
      sub("", "Removing constraints") +
      ex("cn_drop", `ALTER TABLE vendors DROP CONSTRAINT chk_vendors_rating;
ALTER TABLE vendors DROP CONSTRAINT uq_vendors_gst;
ALTER TABLE vendors ALTER COLUMN vendor_name DROP NOT NULL;
ALTER TABLE vendors ALTER COLUMN rating DROP DEFAULT;`) +
      tip("you can only drop a constraint by its <em>name</em>. That is one more reason to name constraints yourself.")
    )}

    ${section("10", "Referential integrity and ON DELETE actions",
      p("<strong>Referential integrity</strong> means every foreign-key value refers to an existing parent row. When a parent row is deleted (or its key changed), PostgreSQL must decide what happens to the child rows. You choose with <code>ON DELETE</code> / <code>ON UPDATE</code>.") +
      fig("sql_referential_integrity.png", "Parent table departments and child table employees with arrows showing what happens to child rows for CASCADE, SET NULL and RESTRICT when a department is deleted") +
      table(["Action", "What happens to the child rows when the parent row is deleted"], [
        [c("NO ACTION") + " (default)", "The delete is rejected if children exist (checked at the end of the statement; can be deferred)"],
        [c("RESTRICT"), "The delete is rejected immediately if children exist"],
        [c("CASCADE"), "The child rows are <strong>deleted too</strong>"],
        [c("SET NULL"), "The child's foreign-key column is set to " + c("NULL")],
        [c("SET DEFAULT"), "The child's foreign-key column is set to its " + c("DEFAULT") + " value"],
      ]) +
      p("Three child tables, one per action, each with the same data:") +
      ex("cn_ri_setup", `CREATE TABLE ri_dept (dept_id INTEGER PRIMARY KEY, dept_name VARCHAR(30));

CREATE TABLE ri_emp_cascade  (emp_id INTEGER PRIMARY KEY, emp_name VARCHAR(30),
    dept_id INTEGER REFERENCES ri_dept (dept_id) ON DELETE CASCADE);
CREATE TABLE ri_emp_setnull  (emp_id INTEGER PRIMARY KEY, emp_name VARCHAR(30),
    dept_id INTEGER REFERENCES ri_dept (dept_id) ON DELETE SET NULL);
CREATE TABLE ri_emp_restrict (emp_id INTEGER PRIMARY KEY, emp_name VARCHAR(30),
    dept_id INTEGER REFERENCES ri_dept (dept_id) ON DELETE RESTRICT);

INSERT INTO ri_dept VALUES (10, 'Sales'), (20, 'HR');
INSERT INTO ri_emp_cascade  VALUES (1, 'Ali', 10), (2, 'Ayesha', 20);
INSERT INTO ri_emp_setnull  VALUES (1, 'Ali', 10), (2, 'Ayesha', 20);
INSERT INTO ri_emp_restrict VALUES (1, 'Ali', 10);`) +
      p("Delete the HR department (20) and see what each child table does:") +
      ex("cn_ri_del", `DELETE FROM ri_dept WHERE dept_id = 20;

SELECT * FROM ri_emp_cascade  ORDER BY emp_id;
SELECT * FROM ri_emp_setnull  ORDER BY emp_id;`) +
      p("<code>CASCADE</code> removed Ayesha along with her department; <code>SET NULL</code> kept her but cleared the department. Now try to delete Sales (10), which <code>ri_emp_restrict</code> still references:") +
      ex("cn_ri_restrict", `DELETE FROM ri_dept WHERE dept_id = 10;`) +
      warn("<code>ON DELETE CASCADE</code> can remove large amounts of data with one statement. Use it for true “parts of” relationships (an order and its order lines), and prefer <code>RESTRICT</code> / <code>SET NULL</code> where history matters (do not cascade-delete a customer’s sales).")
    )}
  `);

/* =========================================================================
   MODULE 3 — Data manipulation (DML): INSERT, import, UPDATE, DELETE
   ========================================================================= */

//# db: ins
topic("insert", "Inserting Data into Tables", "Beginner",
  "INSERT INTO in all its forms: one row, many rows, selected columns, DEFAULT and NULL, INSERT ... SELECT, RETURNING, and ON CONFLICT (UPSERT).",
  "fa-solid fa-square-plus", "Inserting Data into Tables", "Adding rows with INSERT",
  () => `
    ${section("1", "Understanding INSERT",
      p("<code>INSERT</code> adds new rows to a table. It is a <strong>DML</strong> command: it changes data, not structure. All examples in this topic use a <code>students</code> table:") +
      ex("in_create", `CREATE TABLE students (
    student_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_name  VARCHAR(40) NOT NULL,
    email         VARCHAR(60) UNIQUE,
    age           INTEGER,
    city          VARCHAR(30) DEFAULT 'Hyderabad',
    joined_on     DATE        DEFAULT '2026-01-01'
);`) +
      exn("in_syntax", `INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);`, "Syntax") +
      bullets([
        "Text and dates go in <strong>single quotes</strong>: <code>'Ali Khan'</code>, <code>'2026-06-15'</code>. Numbers do not.",
        "Values must match the column list in <strong>number, order and type</strong>.",
        "Always write the column list. Without it you depend on the table's column order, which breaks the day a column is added.",
      ])
    )}

    ${section("2", "Inserting a single record",
      ex("in_single", `INSERT INTO students (student_name, email, age, city, joined_on)
VALUES ('Ali Khan', 'ali@example.com', 20, 'Hyderabad', '2026-06-15');`) +
      p("<code>INSERT 0 1</code> means: one row inserted (the leading <code>0</code> is an old, unused object id).")
    )}

    ${section("3", "Inserting multiple records",
      p("List several value groups, separated by commas, in <strong>one</strong> statement. It is faster than many separate inserts and is all-or-nothing: if one row fails, none are inserted.") +
      ex("in_multi", `INSERT INTO students (student_name, email, age, city, joined_on) VALUES
    ('Ayesha Rao',  'ayesha@example.com', 21, 'Mumbai',    '2026-06-16'),
    ('Ravi Kumar',  'ravi@example.com',   19, 'Bengaluru', '2026-06-17'),
    ('Meena Iyer',  'meena@example.com',  22, 'Chennai',   '2026-06-18');

SELECT * FROM students ORDER BY student_id;`) +
      p("Notice <code>student_id</code> was never supplied: the identity column numbered the rows 1, 2, 3, 4.")
    )}

    ${section("4", "Inserting values into selected columns",
      p("Name only the columns you have values for. All other columns receive their <code>DEFAULT</code>, or <code>NULL</code> if they have none.") +
      ex("in_cols", `INSERT INTO students (student_name, email) VALUES ('John Mathew', 'john@example.com');

SELECT student_id, student_name, age, city, joined_on
FROM students
WHERE student_name = 'John Mathew';`) +
      p("<code>age</code> is <code>NULL</code> (no default) while <code>city</code> and <code>joined_on</code> took their defaults.")
    )}

    ${section("5", "Inserting DEFAULT values and NULL values",
      sub("", "Using the DEFAULT keyword") +
      ex("in_default", `INSERT INTO students (student_name, email, city)
VALUES ('Priya Sharma', 'priya@example.com', DEFAULT);`) +
      p("Other ways: leave the column out (previous section) or use <code>INSERT INTO table DEFAULT VALUES;</code> when <em>every</em> column has a default or accepts <code>NULL</code>.") +
      sub("", "Inserting NULL values") +
      ex("in_null", `INSERT INTO students (student_name, email, age) VALUES ('Karan Mehta', NULL, NULL);

SELECT student_id, student_name, email, age FROM students ORDER BY student_id;`) +
      note("Remember:", "<code>NULL</code> is not zero and not an empty string; it means “unknown”. Write it without quotes.")
    )}

    ${section("6", "INSERT INTO ... SELECT",
      p("Insert the rows that a <code>SELECT</code> returns. This is how you copy data between tables, load a staging table into the real one, or build reporting tables.") +
      ex("in_select", `CREATE TABLE hyd_students (
    student_id    INTEGER,
    student_name  VARCHAR(40),
    city          VARCHAR(30)
);

INSERT INTO hyd_students (student_id, student_name, city)
SELECT student_id, student_name, city
FROM students
WHERE city = 'Hyderabad';

SELECT * FROM hyd_students ORDER BY student_id;`)
    )}

    ${section("7", "RETURNING: get the inserted rows back",
      p("<code>RETURNING</code> returns the row(s) that were just written, including values generated by the database (identity numbers, defaults). No second <code>SELECT</code> is needed.") +
      ex("in_returning", `INSERT INTO students (student_name, email, age)
VALUES ('Sara Fernandes', 'sara@example.com', 23)
RETURNING student_id, student_name, city, joined_on;`) +
      real("an application inserts an order and needs the new <code>order_id</code> immediately to add the order lines. <code>RETURNING order_id</code> gives it in the same round trip.")
    )}

    ${section("8", "Handling duplicates: ON CONFLICT and UPSERT",
      p("Inserting a row whose unique value already exists is an error:") +
      ex("in_dup", `INSERT INTO students (student_name, email, age) VALUES ('Ali K.', 'ali@example.com', 21);`) +
      p("<code>ON CONFLICT</code> lets you choose what to do instead of failing:") +
      table(["Clause", "Behaviour"], [
        [c("ON CONFLICT (email) DO NOTHING"), "Skip the row silently"],
        [c("ON CONFLICT (email) DO UPDATE SET ..."), "Update the existing row instead (an <strong>UPSERT</strong> = UPDATE + INSERT)"],
      ]) +
      ex("in_nothing", `INSERT INTO students (student_name, email, age)
VALUES ('Ali K.', 'ali@example.com', 21)
ON CONFLICT (email) DO NOTHING;`) +
      p("<code>INSERT 0 0</code>: nothing was inserted, and no error appeared. Now the UPSERT, where <code>EXCLUDED</code> stands for the row you tried to insert:") +
      ex("in_upsert", `INSERT INTO students (student_name, email, age)
VALUES ('Ali Khan', 'ali@example.com', 21)
ON CONFLICT (email) DO UPDATE SET age = EXCLUDED.age
RETURNING student_id, student_name, age;`) +
      p("The email existed, so the existing row was updated (Ali's age changed from 20 to 21); a new email would have inserted a new row.") +
      real("daily product-price feeds: new products are inserted, existing ones get their price updated, all in one statement.")
    )}

    ${section("9", "Common INSERT mistakes",
      ex("in_err1", `INSERT INTO students (student_name, email) VALUES ('Sara');`) +
      ex("in_err2", `INSERT INTO students (student_name, age) VALUES ('Tina', 'twenty');`) +
      ex("in_err3", `INSERT INTO students (student_name, joined_on) VALUES ('Tina', '31-02-2026');`) +
      bullets([
        "Number of columns and values differ.",
        "A text value where a number is expected.",
        "An impossible or wrongly formatted date. Use the ISO format <code>'YYYY-MM-DD'</code> and the database will always understand it.",
        "Double quotes instead of single quotes: <code>\"Ali\"</code> is read as a column name.",
      ])
    )}
  `);

//# db: imp
topic("import-data", "Importing Data from External Sources", "Intermediate",
  "CSV files, importing with pgAdmin, COPY and psql \\copy, HEADER / DELIMITER / NULL options, handling missing and invalid data, verifying the import and exporting to CSV.",
  "fa-solid fa-file-csv", "Importing Data from External Sources", "Loading CSV files into PostgreSQL tables",
  () => `
    ${section("1", "Introduction to external data",
      p("Real data rarely starts inside the database. It arrives as exports from other systems: Excel sheets, ERP downloads, website logs, survey results. Getting it <em>into</em> tables is the first job of every analyst, and the format almost everybody uses is <strong>CSV</strong>.") +
      chips([
        ["fa-solid fa-file-csv", "CSV / TSV text files"],
        ["fa-solid fa-file-excel", "Excel (save as CSV first)"],
        ["fa-solid fa-file-code", "JSON"],
        ["fa-solid fa-database", "Other databases"],
      ])
    )}

    ${section("2", "What is a CSV file? Understanding CSV structure",
      p("<strong>CSV</strong> = Comma-Separated Values: a plain-text file where each line is a row and commas separate the columns. The first line usually holds the column names (the <em>header</em>).") +
      codeBlock("sales.csv", `order_id,customer_name,product,quantity,price,order_date
1,Ali Khan,Laptop,1,55000,2026-01-05
2,Ayesha Rao,Mobile,2,20000,2026-01-18
3,Ravi Kumar,Headphones,,3000,2026-02-02
4,John Mathew,Notebook,10,150,
5,Priya Sharma,Pen,20,twenty,2026-03-09`, "fa-solid fa-file-csv") +
      table(["Part", "In the example"], [
        ["Header row", c("order_id,customer_name,…") + " (names, not data)"],
        ["Delimiter", "the comma between values (could also be " + c(";") + ", tab or " + c("|") + ")"],
        ["Empty field", "row 3 has no quantity, row 4 has no date: these become " + c("NULL")],
        ["Quoting", "a value that contains a comma must be quoted: " + c("\"Khan, Ali\"")],
        ["Bad data", "row 5: " + c("twenty") + " where a number should be"],
      ]) +
      tip("always open a CSV in a text editor (Notepad, VS Code) before importing. Excel hides leading zeros, changes date formats and may use <code>;</code> as the separator in some regions.")
    )}

    ${section("3", "Importing CSV data using pgAdmin",
      p("First <strong>create the table</strong>; the import adds rows, it does not create columns. Then:") +
      numlist("", [
        ["Right-click the table", "→ <em>Import/Export Data…</em>"],
        ["Choose <em>Import</em>", "then browse to the CSV file; set <em>Format</em> to <code>csv</code>."],
        ["Options", "turn <em>Header</em> on if the first line holds names; set <em>Delimiter</em> (<code>,</code>) and, if needed, <em>NULL strings</em>."],
        ["Columns", "tick the columns, in the same order as the file."],
        ["OK", "pgAdmin shows a “Process completed” message. Verify the rows with a <code>SELECT</code>."],
      ]) +
      fig("sql_pgadmin_import.png", "pgAdmin Import/Export dialog with Import selected, the CSV filename, format csv, Header switched on and delimiter comma")
    )}

    ${section("4", "Importing with COPY",
      p("<code>COPY</code> is PostgreSQL's fast bulk loader. It runs <strong>on the server</strong>, so the file path is a path <em>on the database server's machine</em>, and the role needs the privilege to read server files (a superuser or a member of <code>pg_read_server_files</code>).") +
      exn("imp_table", `CREATE TABLE sales (
    order_id       INTEGER PRIMARY KEY,
    customer_name  VARCHAR(40),
    product        VARCHAR(40),
    quantity       INTEGER,
    price          NUMERIC(10,2),
    order_date     DATE
);`, "Step 1: table") +
      exo("imp_copy", `COPY sales FROM 'C:/data/sales.csv' WITH (FORMAT csv, HEADER true);`, `COPY 5`, "Step 2: COPY") +
      p("<code>COPY 5</code> reports the number of rows loaded. <strong>Our file has bad data (row 5), so this load would stop with an error</strong> and load nothing; the next sections show how to deal with that.")
    )}

    ${section("5", "Importing with \\copy in psql",
      p("<code>\\copy</code> is a psql command that reads the file on <strong>your own computer</strong> and sends it to the server. It needs no special server privileges, so it is the easiest choice when the server is remote or in the cloud.") +
      sh("psql", `\\copy sales FROM 'C:/data/sales.csv' WITH (FORMAT csv, HEADER true)`) +
      table(["", "COPY", "\\copy"], [
        ["Runs on", "Database server", "Your computer (psql client)"],
        ["File location", "On the server machine", "On the machine where psql runs"],
        ["Privileges", "Superuser or " + c("pg_read_server_files"), "Ordinary table privileges"],
        ["Written as", "SQL command, ends with " + c(";"), "psql command, one line, no semicolon"],
      ])
    )}

    ${section("6", "The HEADER, DELIMITER and NULL options",
      table(["Option", "Meaning", "Example"], [
        [c("FORMAT csv"), "Treat the file as CSV (quotes, escapes)", c("WITH (FORMAT csv)")],
        [c("HEADER true"), "Skip the first line (it holds column names)", c("HEADER true")],
        [c("DELIMITER"), "The separator character", c("DELIMITER ';'") + " or " + c("E'\\t'") + " for tab files"],
        [c("NULL"), "Text that means NULL. In CSV, an unquoted empty field is NULL by default", c("NULL 'NA'")],
        [c("QUOTE"), "Character used to quote values (default " + c("\"") + ")", c("QUOTE '\"'")],
        [c("ENCODING"), "File's character set, if not the database default", c("ENCODING 'UTF8'")],
      ]) +
      exn("imp_options", `COPY sales (order_id, customer_name, product, quantity, price, order_date)
FROM 'C:/data/sales_eu.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';', NULL 'NA', ENCODING 'UTF8');`, "Several options together")
    )}

    ${section("7", "Handling missing or invalid data during import",
      p("<code>COPY</code> is strict: one bad value (like <code>twenty</code> in a numeric column) aborts the whole import. The professional approach is a <strong>staging table</strong>:") +
      numlist("", [
        ["Load everything as text", "into a staging table whose columns are all <code>TEXT</code>; nothing can fail on a type error."],
        ["Inspect", "with SQL: count rows, find NULLs, find values that do not look like numbers or dates."],
        ["Clean and convert", "with <code>INSERT ... SELECT</code> into the real, properly typed table."],
      ]) +
      p("Step 1: the staging table, loaded here with the five CSV rows (an unquoted empty CSV field arrives as <code>NULL</code>):") +
      ex("imp_stage", `CREATE TABLE sales_raw (
    order_id TEXT, customer_name TEXT, product TEXT,
    quantity TEXT, price TEXT, order_date TEXT
);

-- what COPY ... FROM 'sales.csv' would have loaded:
INSERT INTO sales_raw VALUES
    ('1', 'Ali Khan',     'Laptop',     '1',  '55000',  '2026-01-05'),
    ('2', 'Ayesha Rao',   'Mobile',     '2',  '20000',  '2026-01-18'),
    ('3', 'Ravi Kumar',   'Headphones', NULL, '3000',   '2026-02-02'),
    ('4', 'John Mathew',  'Notebook',   '10', '150',    NULL),
    ('5', 'Priya Sharma', 'Pen',        '20', 'twenty', '2026-03-09');`) +
      p("Step 2: inspect.") +
      ex("imp_inspect", `SELECT count(*)           AS total_rows,
       count(quantity)    AS quantity_filled,
       count(order_date)  AS date_filled
FROM sales_raw;`) +
      p("<code>count(column)</code> counts only the non-NULL values, so the gaps stand out. Now find the values that are not valid numbers:") +
      ex("imp_bad", `SELECT order_id, product, price
FROM sales_raw
WHERE price !~ '^[0-9]+([.][0-9]+)?$';`) +
      p("Step 3: create the typed table and load only the clean rows, giving a missing quantity a default of 1:") +
      ex("imp_clean", `CREATE TABLE sales (
    order_id       INTEGER PRIMARY KEY,
    customer_name  VARCHAR(40),
    product        VARCHAR(40),
    quantity       INTEGER,
    price          NUMERIC(10,2),
    order_date     DATE
);

INSERT INTO sales
SELECT order_id::integer, customer_name, product,
       COALESCE(quantity::integer, 1), price::numeric, order_date::date
FROM sales_raw
WHERE price ~ '^[0-9]+([.][0-9]+)?$';

SELECT * FROM sales ORDER BY order_id;`) +
      p("Order 5 (bad price) was held back for correction; order 3 got quantity 1; order 4 kept an empty date. The rejected rows stay in <code>sales_raw</code> to be fixed at the source.") +
      real("every month's finance export, web-shop download or survey result goes through exactly this staging → check → clean → load routine.")
    )}

    ${section("8", "Verifying imported records",
      bullets([
        "<strong>Row count</strong>: compare <code>SELECT count(*)</code> with the number of data lines in the file (minus the header).",
        "<strong>Look at samples</strong>: <code>SELECT * FROM sales LIMIT 10;</code>",
        "<strong>Check NULLs and ranges</strong>: <code>min()</code>, <code>max()</code>, <code>count(column)</code>.",
        "<strong>Check totals</strong>: does <code>SUM(price)</code> equal the total in the source report?",
      ]) +
      ex("imp_verify", `SELECT count(*)         AS rows_loaded,
       min(order_date)   AS first_date,
       max(order_date)   AS last_date,
       sum(price * quantity) AS total_value
FROM sales;`)
    )}

    ${section("9", "Exporting table data into CSV",
      exo("imp_export", `COPY sales TO 'C:/data/sales_export.csv' WITH (FORMAT csv, HEADER true);`, `COPY 4`, "Whole table (server side)") +
      exo("imp_export_q", `COPY (SELECT product, SUM(quantity) AS units FROM sales GROUP BY product)
TO 'C:/data/units_by_product.csv' WITH (FORMAT csv, HEADER true);`, `COPY 3`, "Query result (server side)") +
      sh("psql: save to your own computer", `\\copy (SELECT * FROM sales ORDER BY order_id) TO 'sales_export.csv' WITH (FORMAT csv, HEADER true)`) +
      p("In pgAdmin: run a query → click the <em>Download as CSV</em> button above the result grid, or right-click a table → <em>Import/Export Data… → Export</em>.")
    )}
  `);

//# db: upd emp
topic("update", "Updating Data", "Beginner",
  "UPDATE syntax, one or many columns, WHERE, calculated updates, subqueries, UPDATE ... FROM, RETURNING and the mistakes to avoid.",
  "fa-solid fa-pen-to-square", "Updating Data", "Changing existing rows with UPDATE",
  () => `
    ${section("1", "Introduction to UPDATE",
      p("<code>UPDATE</code> changes the values in <strong>existing rows</strong>. It is the DML command for corrections and business changes: a raise, a new address, a status change.") +
      p("The examples use the <code>employees</code> and <code>departments</code> tables. Run this script first:") +
      codeBlock("Setup script", SETUP_EMP) +
      callout("fa-solid fa-triangle-exclamation", "<p><strong>The golden rule:</strong> <code>UPDATE</code> without <code>WHERE</code> changes <em>every row</em> in the table.</p>")
    )}

    ${section("2", "UPDATE statement: syntax",
      exn("up_syntax", `UPDATE table_name
SET    column1 = value1,
       column2 = value2
WHERE  condition;`, "Syntax") +
      bullets([
        "<code>SET</code> lists the columns to change and their new values.",
        "<code>WHERE</code> picks the rows. Rows that do not match are untouched.",
        "The result <code>UPDATE n</code> tells you how many rows were changed. Check it every time.",
      ])
    )}

    ${section("3", "Updating a single column",
      ex("up_single", `UPDATE employees
SET salary = 60000
WHERE emp_id = 107;

SELECT emp_id, emp_name, salary FROM employees WHERE emp_id = 107;`)
    )}

    ${section("4", "Updating multiple columns",
      ex("up_multi", `UPDATE employees
SET salary = 70000,
    city   = 'Hyderabad'
WHERE emp_id = 104;

SELECT emp_id, emp_name, salary, city FROM employees WHERE emp_id = 104;`) +
      p("Separate the assignments with commas (no comma before <code>WHERE</code>).")
    )}

    ${section("5", "Updating selected records using WHERE and conditions",
      sub("", "A calculated update: 10% raise for Sales") +
      ex("up_calc", `UPDATE employees
SET salary = salary * 1.10
WHERE dept_id = 10;

SELECT emp_name, salary FROM employees WHERE dept_id = 10 ORDER BY emp_id;`) +
      p("The new value can use the old value of the same row: <code>salary = salary * 1.10</code>.") +
      sub("", "Several conditions with AND / IN") +
      ex("up_cond", `UPDATE employees
SET commission = 1000
WHERE dept_id IN (20, 30)
  AND salary < 70000
  AND commission IS NULL;`) +
      sub("", "Updating rows that have NULL") +
      ex("up_null", `UPDATE employees
SET dept_id = 20
WHERE dept_id IS NULL;`) +
      p("Sara had no department; she is now in HR. Remember: to test for emptiness, use <code>IS NULL</code>, never <code>= NULL</code>:") +
      ex("up_null_wrong", `UPDATE employees
SET city = 'Unknown'
WHERE commission = NULL;`) +
      p("<code>UPDATE 0</code>: <code>commission = NULL</code> is never true, so nothing matched. No error, no change, a classic silent bug.")
    )}

    ${section("6", "Updating using subqueries",
      p("The <code>WHERE</code> condition, or the new value, can come from another query.") +
      ex("up_subq_where", `UPDATE employees
SET salary = salary + 2000
WHERE dept_id = (SELECT dept_id FROM departments WHERE dept_name = 'HR');`) +
      ex("up_subq_set", `UPDATE employees
SET commission = (SELECT AVG(commission) FROM employees WHERE dept_id = 10)
WHERE emp_id = 108;

SELECT emp_id, emp_name, commission FROM employees WHERE emp_id = 108;`) +
      p("The subquery in <code>SET</code> must return exactly one value.")
    )}

    ${section("7", "UPDATE ... FROM: updating with data from another table",
      p("PostgreSQL's <code>FROM</code> clause in an <code>UPDATE</code> lets you join another table and copy values across. Here every IT employee gets the city of the IT department:") +
      ex("up_from", `UPDATE employees e
SET    city = d.location
FROM   departments d
WHERE  e.dept_id = d.dept_id
  AND  d.dept_name = 'IT';

SELECT emp_name, city FROM employees WHERE dept_id = 30 ORDER BY emp_id;`) +
      tip("always include the join condition (<code>e.dept_id = d.dept_id</code>). Without it, every row is paired with every department, which is a join explosion and a wrong update.")
    )}

    ${section("8", "Using RETURNING with UPDATE",
      ex("up_returning", `UPDATE employees
SET salary = salary + 1000
WHERE emp_id = 101
RETURNING emp_id, emp_name, salary;`) +
      p("You see the <strong>new</strong> values of the changed rows immediately, which is perfect for confirming the change.")
    )}

    ${section("9", "Common UPDATE mistakes",
      sub("1.", "Forgetting WHERE") +
      p("Protect yourself by wrapping risky changes in a <strong>transaction</strong> (covered later). If the result is wrong, <code>ROLLBACK</code> undoes it:") +
      ex("up_mistake", `BEGIN;
UPDATE employees SET salary = 0;                 -- oops: no WHERE
SELECT emp_name, salary FROM employees ORDER BY emp_id LIMIT 3;
ROLLBACK;                                        -- undo everything
SELECT emp_name, salary FROM employees ORDER BY emp_id LIMIT 3;`) +
      sub("2.", "Other mistakes") +
      bullets([
        "<code>= NULL</code> instead of <code>IS NULL</code> (shown above).",
        "Updating a <strong>primary key</strong> that other tables reference; the foreign key will block it unless <code>ON UPDATE CASCADE</code> is defined.",
        "A wrong data type or a value that breaks a <code>CHECK</code> / <code>NOT NULL</code> constraint, which aborts the whole statement.",
        "Not checking the row count: <code>UPDATE 0</code> means your <code>WHERE</code> matched nothing; <code>UPDATE 500</code> when you expected 1 means it matched too much.",
      ]) +
      callout("fa-solid fa-shield-halved", "<p><strong>Safe habit:</strong> first run <code>SELECT * FROM employees WHERE &lt;your condition&gt;;</code>, look at the rows, then change <code>SELECT *</code> into <code>UPDATE ... SET ...</code> with the same <code>WHERE</code>.</p>")
    )}
  `);

//# db: del emp
topic("delete", "Deleting Data", "Beginner",
  "DELETE syntax, deleting one or many rows, WHERE, subqueries, DELETE ... USING, RETURNING, foreign-key protection, soft deletes and safe practices.",
  "fa-solid fa-trash-can", "Deleting Data", "Removing rows with DELETE",
  () => `
    ${section("1", "Introduction to DELETE",
      p("<code>DELETE</code> removes <strong>rows</strong> from a table. The table and its columns stay. Like <code>UPDATE</code>, it is dangerous without a <code>WHERE</code> clause: it removes <em>every</em> row.") +
      p("The examples use the same <code>employees</code> and <code>departments</code> tables (setup script in the Updating Data topic):") +
      codeBlock("Setup script", SETUP_EMP)
    )}

    ${section("2", "DELETE statement: syntax",
      exn("de_syntax", `DELETE FROM table_name
WHERE  condition;`, "Syntax") +
      p("The result <code>DELETE n</code> reports how many rows were removed.")
    )}

    ${section("3", "Deleting a particular record",
      p("Use the primary key in the <code>WHERE</code> so exactly one row is affected:") +
      ex("de_one", `DELETE FROM employees
WHERE emp_id = 108;`)
    )}

    ${section("4", "Deleting multiple records and using WHERE",
      ex("de_where", `DELETE FROM employees
WHERE city = 'Hyderabad'
  AND salary < 50000;`) +
      p("Any condition from the filtering topics works: <code>IN</code>, <code>BETWEEN</code>, <code>LIKE</code>, <code>IS NULL</code>, and combinations with <code>AND</code> / <code>OR</code>.")
    )}

    ${section("5", "Deleting records using subqueries",
      ex("de_subq", `DELETE FROM employees
WHERE dept_id = (SELECT dept_id FROM departments WHERE dept_name = 'HR');`) +
      p("Priya Sharma, the only HR employee, is gone, found through the department name rather than a number.")
    )}

    ${section("6", "DELETE ... USING",
      p("<code>USING</code> adds other tables to the <code>DELETE</code> so you can filter by their columns. Delete the Bengaluru employees earning less than 70,000:") +
      ex("de_using", `DELETE FROM employees e
USING departments d
WHERE e.dept_id = d.dept_id
  AND d.location = 'Bengaluru'
  AND e.salary < 70000;`) +
      tip("<code>DELETE ... USING</code> is the PostgreSQL way to write a delete with a join. It corresponds to <code>UPDATE ... FROM</code>.")
    )}

    ${section("7", "Using RETURNING with DELETE",
      ex("de_returning", `DELETE FROM employees
WHERE emp_id = 106
RETURNING emp_id, emp_name, salary;`) +
      real("archive-then-delete: <code>WITH gone AS (DELETE ... RETURNING *) INSERT INTO archive SELECT * FROM gone;</code> moves rows to an archive table in one atomic statement.")
    )}

    ${section("8", "Foreign keys protect your data",
      p("Three employees remain (101, 102, 103). Try to delete a department that still has employees:") +
      ex("de_fk", `DELETE FROM departments WHERE dept_id = 10;`) +
      p("The foreign key refuses. Delete (or move) the employees first, or delete a department nobody uses:") +
      ex("de_fk_ok", `DELETE FROM departments WHERE dept_id = 40;`)
    )}

    ${section("9", "TRUNCATE vs DELETE vs DROP",
      table(["", "DELETE", "TRUNCATE", "DROP"], [
        ["Removes", "Chosen rows (or all)", "All rows", "The table itself"],
        ["WHERE allowed", "Yes", "No", "No"],
        ["Structure kept", "Yes", "Yes", "No"],
        ["Speed on big tables", "Slowest", "Fast", "Fast"],
      ]) +
      p("The full comparison is in <em>Altering and Dropping Tables</em>.")
    )}

    ${section("10", "Safe practices before deleting records",
      numlist("", [
        ["Preview with SELECT", "run <code>SELECT * FROM t WHERE &lt;condition&gt;</code> first and read the rows."],
        ["Count the rows", "does <code>SELECT count(*)</code> match what you expect?"],
        ["Use a transaction", "<code>BEGIN; DELETE ...; SELECT ...; ROLLBACK;</code> (or <code>COMMIT;</code> when happy)."],
        ["Back up first", "for important tables, <code>CREATE TABLE t_backup AS SELECT * FROM t;</code> or <code>pg_dump</code>."],
        ["Prefer soft deletes", "mark rows inactive instead of removing them, so history survives."],
      ]) +
      ex("de_txn", `BEGIN;
DELETE FROM employees;                         -- no WHERE: everything
SELECT count(*) AS rows_inside_transaction FROM employees;
ROLLBACK;
SELECT count(*) AS rows_after_rollback FROM employees;`) +
      sub("", "Soft delete") +
      ex("de_soft", `ALTER TABLE employees ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

UPDATE employees SET is_active = FALSE WHERE emp_id = 103;   -- "delete" Ravi

SELECT emp_id, emp_name FROM employees WHERE is_active ORDER BY emp_id;`) +
      p("Every normal query then adds <code>WHERE is_active</code>. Nothing is lost, and Ravi can be restored with one <code>UPDATE</code>.")
    )}
  `);

/* =========================================================================
   MODULE 4 — SQL query writing and data retrieval (DQL)
   SELECT, WHERE
   ========================================================================= */

//# db: sel emp
topic("select-basics", "Introduction to the SELECT Statement", "Beginner",
  "SELECT *, choosing columns, DISTINCT, column and table aliases, concatenation, arithmetic and calculated columns, operator precedence and NULL in expressions.",
  "fa-solid fa-magnifying-glass", "Introduction to SELECT", "Asking the database questions",
  () => `
    ${section("1", "Understanding SELECT",
      p("<code>SELECT</code> is the most used command in SQL: it <strong>reads</strong> data and never changes it. You choose <em>which columns</em> to see and <em>from which table</em>.") +
      exn("se_syntax", `SELECT  column1, column2, ...
FROM    table_name;`, "Syntax") +
      p("All examples use the <code>employees</code> and <code>departments</code> tables. Run the setup script once:") +
      codeBlock("Setup script", SETUP_EMP) +
      callout("fa-solid fa-circle-info", "<p>The result of a <code>SELECT</code> is itself a table (rows and columns), but it is <em>temporary</em>: it exists only on your screen. The stored table is not touched.</p>")
    )}

    ${section("2", "SELECT *: all columns",
      p("The asterisk <code>*</code> means “every column”.") +
      ex("se_all", `SELECT * FROM departments;`) +
      tip("<code>SELECT *</code> is handy for exploring a table. In real reports and applications, list only the columns you need: it is faster, clearer, and does not break when someone adds a column.")
    )}

    ${section("3", "Selecting specific and multiple columns",
      ex("se_cols", `SELECT emp_name, salary
FROM employees;`) +
      p("Columns appear in the order you write them, not the order stored in the table:") +
      ex("se_cols2", `SELECT city, emp_name, emp_id
FROM employees
WHERE emp_id <= 103;`)
    )}

    ${section("4", "SELECT DISTINCT: remove duplicates",
      p("<code>DISTINCT</code> returns each different value only once.") +
      ex("se_distinct", `SELECT DISTINCT city
FROM employees
ORDER BY city;`) +
      p("With several columns, DISTINCT looks at the whole <em>combination</em>:") +
      ex("se_distinct2", `SELECT DISTINCT dept_id, city
FROM employees
ORDER BY dept_id, city;`) +
      p("<code>NULL</code> counts as a value of its own (Sara has no department).")
    )}

    ${section("5", "Column aliases with AS: renaming output columns",
      p("An <strong>alias</strong> gives a column a friendlier name in the result. It changes only the heading shown, never the table.") +
      ex("se_alias", `SELECT emp_name        AS employee,
       salary          AS monthly_salary,
       salary * 12     AS "Annual Salary"
FROM employees
WHERE dept_id = 10;`) +
      bullets([
        "<code>AS</code> is optional but recommended for readability.",
        "An alias with spaces or capital letters needs <strong>double quotes</strong>: <code>\"Annual Salary\"</code>.",
        "You cannot use a column alias in <code>WHERE</code> (the filter runs before the alias exists). You can use it in <code>ORDER BY</code>.",
      ])
    )}

    ${section("6", "Table aliases",
      p("A table alias is a short nickname for a table inside one query. It makes queries shorter and becomes essential with joins.") +
      ex("se_tbl_alias", `SELECT e.emp_name, e.salary
FROM employees AS e
WHERE e.dept_id = 30;`)
    )}

    ${section("7", "Column concatenation: || and CONCAT()",
      p("Join text values with <code>||</code>, or with the functions <code>CONCAT()</code> and <code>CONCAT_WS()</code> (with separator).") +
      ex("se_concat", `SELECT emp_name || ' works in ' || city AS description
FROM employees
WHERE emp_id <= 103;`) +
      p("The two ways differ for <code>NULL</code>: <code>||</code> returns NULL if <em>any</em> part is NULL; <code>CONCAT</code> treats NULL as empty text.") +
      ex("se_concat_null", `SELECT emp_name,
       emp_name || ' / ' || commission          AS with_pipes,
       CONCAT(emp_name, ' / ', commission)      AS with_concat,
       CONCAT_WS(', ', emp_name, city)          AS with_separator
FROM employees
WHERE emp_id IN (101, 103);`)
    )}

    ${section("8", "Arithmetic operators and calculated columns",
      table(["Operator", "Meaning", "Example", "Result"], [
        [c("+"), "Addition", c("15 + 4"), "19"],
        [c("-"), "Subtraction", c("15 - 4"), "11"],
        [c("*"), "Multiplication", c("15 * 4"), "60"],
        [c("/"), "Division", c("15 / 4") + " vs " + c("15 / 4.0"), "3 (integers!) vs 3.75"],
        [c("%"), "Remainder (modulo)", c("15 % 4"), "3"],
      ]) +
      ex("se_arith", `SELECT 15 + 4   AS addition,
       15 - 4   AS subtraction,
       15 * 4   AS multiplication,
       15 / 4   AS integer_division,
       15 / 4.0 AS decimal_division,
       15 % 4   AS remainder;`) +
      warn("dividing two integers throws away the decimals. Make one side decimal (<code>4.0</code> or <code>::numeric</code>) to keep them.") +
      sub("", "Calculated columns") +
      p("A column in the result can be a calculation on other columns. It is computed for every row, and nothing is stored.") +
      ex("se_calc", `SELECT emp_name,
       salary,
       salary * 12          AS annual_salary,
       salary * 0.10        AS bonus_10_percent
FROM employees
WHERE dept_id = 10;`)
    )}

    ${section("9", "Operator precedence",
      p("When several operators appear, PostgreSQL follows the maths order: first <strong>brackets</strong>, then <strong><code>*</code> <code>/</code> <code>%</code></strong>, then <strong><code>+</code> <code>-</code></strong>. Equal priority is evaluated left to right.") +
      ex("se_prec", `SELECT 2 + 3 * 4     AS without_brackets,
       (2 + 3) * 4   AS with_brackets;`) +
      tip("when in doubt, add brackets. They cost nothing and make the intention obvious.")
    )}

    ${section("10", "NULL in expressions",
      p("Any arithmetic with <code>NULL</code> gives <code>NULL</code>, because “unknown + 5” is still unknown.") +
      ex("se_null", `SELECT emp_name, salary, commission,
       salary + commission AS total_pay
FROM employees
ORDER BY emp_id;`) +
      p("Only employees who have a commission get a total. Replace the missing value with <code>COALESCE</code> (covered in the next topic):") +
      ex("se_null_fix", `SELECT emp_name,
       salary + COALESCE(commission, 0) AS total_pay
FROM employees
ORDER BY emp_id;`)
    )}
  `);

//# db: wh emp
topic("where-basics", "Filtering with WHERE: Comparison and Logical Operators", "Beginner",
  "The WHERE clause, the six comparison operators, filtering numbers, text and dates, and combining conditions with AND, OR, NOT and parentheses.",
  "fa-solid fa-filter", "Filtering Data with WHERE", "Comparison and logical operators",
  () => `
    ${section("", "What is WHERE?",
      p("<code>WHERE</code> keeps only the <strong>rows</strong> that satisfy a condition. It comes after <code>FROM</code>:") +
      exn("wh_syntax", `SELECT  columns
FROM    table_name
WHERE   condition;`, "Syntax") +
      p("A <strong>condition</strong> evaluates to TRUE, FALSE or NULL (unknown). Only rows where it is <strong>TRUE</strong> are returned.") +
      p("Data used here: <code>employees</code> and <code>departments</code> (setup script in the SELECT topic).")
    )}

    ${section("11.1", "Comparison operators",
      table(["Operator", "Meaning", "Example"], [
        [c("="), "Equal to", c("dept_id = 30")],
        [c(">"), "Greater than", c("salary > 60000")],
        [c("<"), "Less than", c("salary < 50000")],
        [c(">="), "Greater than or equal to", c("salary >= 62000")],
        [c("<="), "Less than or equal to", c("salary <= 55000")],
        [c("!=") + " or " + c("<>"), "Not equal to", c("city <> 'Mumbai'")],
      ]) +
      sub("1.", "Equal to (=)") +
      ex("wh_eq", `SELECT emp_name, dept_id FROM employees WHERE dept_id = 30;`) +
      sub("2.", "Greater than (>)") +
      ex("wh_gt", `SELECT emp_name, salary FROM employees WHERE salary > 70000;`) +
      sub("3.", "Less than (<)") +
      ex("wh_lt", `SELECT emp_name, salary FROM employees WHERE salary < 50000;`) +
      sub("4.", "Greater than or equal to (>=)") +
      ex("wh_ge", `SELECT emp_name, salary FROM employees WHERE salary >= 68000;`) +
      sub("5.", "Less than or equal to (<=)") +
      ex("wh_le", `SELECT emp_name, salary FROM employees WHERE salary <= 52000;`) +
      sub("6.", "Not equal to (<> or !=)") +
      ex("wh_ne", `SELECT emp_name, city FROM employees WHERE city <> 'Hyderabad';`) +
      callout("fa-solid fa-triangle-exclamation", "<p><strong>Single <code>=</code>, not double.</strong> SQL uses one equals sign for comparison (<code>WHERE dept_id = 30</code>). Using <code>==</code> is a syntax error.</p>") +

      sub("", "Filtering text") +
      p("Text values go in <strong>single quotes</strong>, and the comparison is <strong>case sensitive</strong>:") +
      ex("wh_text", `SELECT emp_name, city FROM employees WHERE city = 'Hyderabad';`) +
      ex("wh_text_case", `SELECT emp_name, city FROM employees WHERE city = 'hyderabad';`) +
      p("(Zero rows: <code>'hyderabad'</code> is not <code>'Hyderabad'</code>. The next topic shows <code>ILIKE</code> for case-insensitive matching.)") +

      sub("", "Filtering dates") +
      p("Write dates as <code>'YYYY-MM-DD'</code>. Earlier dates are smaller.") +
      ex("wh_date", `SELECT emp_name, hire_date
FROM employees
WHERE hire_date >= '2022-01-01'
ORDER BY hire_date;`)
    )}

    ${section("11.2", "Logical operators: AND, OR, NOT",
      table(["Operator", "Rule", "Example"], [
        [c("AND"), "<strong>Both</strong> conditions must be true", c("dept_id = 30 AND salary > 70000")],
        [c("OR"), "<strong>At least one</strong> condition must be true", c("dept_id = 10 OR dept_id = 20")],
        [c("NOT"), "Reverses a condition", c("NOT city = 'Mumbai'")],
      ]) +
      sub("1.", "AND") +
      ex("wh_and", `SELECT emp_name, dept_id, salary
FROM employees
WHERE dept_id = 30 AND salary > 70000;`) +
      sub("2.", "OR") +
      ex("wh_or", `SELECT emp_name, dept_id
FROM employees
WHERE dept_id = 10 OR dept_id = 20
ORDER BY emp_id;`) +
      sub("3.", "NOT") +
      ex("wh_not", `SELECT emp_name, city
FROM employees
WHERE NOT city = 'Hyderabad'
ORDER BY emp_id;`) +
      sub("4.", "Combining multiple conditions") +
      ex("wh_combo", `SELECT emp_name, city, salary
FROM employees
WHERE city = 'Hyderabad' AND salary >= 55000 AND hire_date < '2021-01-01';`) +

      sub("5.", "Operator precedence and parentheses") +
      p("<code>NOT</code> is evaluated first, then <code>AND</code>, then <code>OR</code>. Mixing <code>AND</code> and <code>OR</code> without brackets is the most common WHERE mistake.") +
      ex("wh_prec1", `-- Intended: Sales or IT employees who earn more than 65000
SELECT emp_name, dept_id, salary
FROM employees
WHERE dept_id = 10 OR dept_id = 30 AND salary > 65000
ORDER BY emp_id;`) +
      p("Ali (55,000) slipped through: PostgreSQL read it as <code>dept_id = 10</code> <strong>OR</strong> (<code>dept_id = 30 AND salary &gt; 65000</code>). Add brackets to say what you mean:") +
      ex("wh_prec2", `SELECT emp_name, dept_id, salary
FROM employees
WHERE (dept_id = 10 OR dept_id = 30) AND salary > 65000
ORDER BY emp_id;`) +
      sub("", "Truth table") +
      table(["A", "B", "A AND B", "A OR B", "NOT A"], [
        ["TRUE", "TRUE", "TRUE", "TRUE", "FALSE"],
        ["TRUE", "FALSE", "FALSE", "TRUE", "FALSE"],
        ["FALSE", "TRUE", "FALSE", "TRUE", "TRUE"],
        ["FALSE", "FALSE", "FALSE", "FALSE", "TRUE"],
      ]) +
      callout("fa-solid fa-circle-info", "<p><strong>NULL in conditions:</strong> a comparison with <code>NULL</code> gives “unknown”, and unknown rows are not returned. That is why <code>WHERE commission = NULL</code> finds nothing; use <code>IS NULL</code> (next topic).</p>")
    )}
  `);

//# db: wh2 emp
topic("where-special", "Special Filtering Operators", "Beginner",
  "IN, NOT IN, BETWEEN, LIKE and ILIKE with wildcards, IS NULL, COALESCE() and NULLIF(), plus practical business filtering on numbers, text and dates.",
  "fa-solid fa-filter-circle-xmark", "Special Filtering Operators", "IN, BETWEEN, LIKE, NULL handling and real filters",
  () => `
    ${section("11.3", "IN and NOT IN",
      p("<code>IN</code> checks a value against a list. It replaces a chain of <code>OR</code>s.") +
      ex("sp_in", `SELECT emp_name, city
FROM employees
WHERE city IN ('Hyderabad', 'Mumbai')
ORDER BY emp_id;`) +
      ex("sp_notin", `SELECT emp_name, city
FROM employees
WHERE city NOT IN ('Hyderabad', 'Mumbai')
ORDER BY emp_id;`) +
      callout("fa-solid fa-triangle-exclamation", "<p><strong>The <code>NOT IN</code> + <code>NULL</code> trap.</strong> If the list contains a <code>NULL</code>, <code>NOT IN</code> never returns a row, because every comparison with NULL is unknown.</p>") +
      ex("sp_notin_null", `SELECT emp_name FROM employees WHERE dept_id NOT IN (10, NULL);`) +
      p("Zero rows, although many employees are outside department 10. This matters when the list comes from a subquery that can return NULL; use <code>NOT EXISTS</code> there (subqueries topic).")
    )}

    ${section("", "BETWEEN and NOT BETWEEN",
      p("<code>BETWEEN a AND b</code> is true for values from <code>a</code> to <code>b</code>, <strong>both ends included</strong>. It is the same as <code>&gt;= a AND &lt;= b</code>.") +
      ex("sp_between", `SELECT emp_name, salary
FROM employees
WHERE salary BETWEEN 50000 AND 68000
ORDER BY salary;`) +
      ex("sp_notbetween", `SELECT emp_name, salary
FROM employees
WHERE salary NOT BETWEEN 50000 AND 68000
ORDER BY salary;`) +
      ex("sp_between_date", `SELECT emp_name, hire_date
FROM employees
WHERE hire_date BETWEEN '2019-01-01' AND '2020-12-31'
ORDER BY hire_date;`)
    )}

    ${section("", "LIKE and ILIKE: pattern matching",
      p("<code>LIKE</code> finds text that matches a pattern. Two <strong>wildcards</strong> build the pattern:") +
      table(["Wildcard", "Matches", "Pattern", "Matches e.g."], [
        [c("%"), "Any number of characters (including none)", c("'A%'"), "Ali, Ayesha"],
        [c("_"), "Exactly one character", c("'_ohn%'"), "John Mathew"],
      ]) +
      sub("", "Starts with, ends with, contains") +
      ex("sp_like1", `SELECT emp_name FROM employees WHERE emp_name LIKE 'A%' ORDER BY emp_id;`, "Starts with A") +
      ex("sp_like2", `SELECT emp_name FROM employees WHERE emp_name LIKE '%Kumar' ORDER BY emp_id;`, "Ends with Kumar") +
      ex("sp_like3", `SELECT emp_name FROM employees WHERE emp_name LIKE '%an%' ORDER BY emp_id;`, "Contains 'an'") +
      ex("sp_like4", `SELECT emp_name FROM employees WHERE emp_name LIKE '_ohn%';`, "One unknown letter, then 'ohn'") +
      sub("", "ILIKE: case-insensitive (PostgreSQL)") +
      p("<code>LIKE</code> is case sensitive. PostgreSQL adds <code>ILIKE</code>, which ignores case:") +
      ex("sp_like_case", `SELECT emp_name FROM employees WHERE emp_name LIKE '%kumar%';`) +
      ex("sp_ilike", `SELECT emp_name FROM employees WHERE emp_name ILIKE '%kumar%';`) +
      tip("to search for a real <code>%</code> or <code>_</code> character, put an escape in front: <code>LIKE '50\\\\%' ESCAPE '\\\\'</code>. <code>NOT LIKE</code> and <code>NOT ILIKE</code> reverse the test.") +
      warn("a pattern that starts with <code>%</code> cannot use a normal index, so it is slow on huge tables.")
    )}

    ${section("", "IS NULL and IS NOT NULL",
      p("<code>NULL</code> means “no value”. It is not equal to anything, not even to another NULL, so the ordinary <code>=</code> does not work:") +
      ex("sp_null_wrong", `SELECT emp_name, commission FROM employees WHERE commission = NULL;`) +
      ex("sp_isnull", `SELECT emp_name, commission FROM employees WHERE commission IS NULL ORDER BY emp_id;`) +
      ex("sp_isnotnull", `SELECT emp_name, commission FROM employees WHERE commission IS NOT NULL ORDER BY emp_id;`) +
      real("finding incomplete records: customers without an email, orders without a delivery date, employees without a manager.")
    )}

    ${section("", "COALESCE() and NULLIF()",
      sub("", "COALESCE: first non-NULL value") +
      p("<code>COALESCE(a, b, c, ...)</code> returns the first value in the list that is not NULL. It is the standard way to supply a fallback.") +
      ex("sp_coalesce", `SELECT emp_name,
       commission,
       COALESCE(commission, 0)                      AS commission_or_zero,
       COALESCE(commission::text, 'no commission')  AS commission_label
FROM employees
ORDER BY emp_id;`) +
      sub("", "NULLIF: turn a value into NULL") +
      p("<code>NULLIF(a, b)</code> returns <code>NULL</code> if <code>a = b</code>, otherwise <code>a</code>. Its classic use is avoiding division by zero:") +
      ex("sp_div0", `SELECT 100 / 0 AS result;`) +
      ex("sp_nullif", `SELECT 100 / NULLIF(0, 0) AS result;`) +
      p("Dividing by <code>NULL</code> gives <code>NULL</code> instead of an error, so one bad row cannot break the entire report.")
    )}

    ${section("11.4", "Practical filtering with business examples",
      /*# db: spshop shop */ "" +
      p("Examples on the online shop tables. Setup script (run once):") +
      codeBlock("Setup script (shop)", SETUP_SHOP) +
      sub("", "Numerical data: expensive products") +
      ex("sp_shop1", `SELECT product_name, price
FROM products
WHERE price BETWEEN 5000 AND 60000
ORDER BY price DESC;`) +
      sub("", "Text data: customers from two cities, name starting with A") +
      ex("sp_shop2", `SELECT customer_name, city
FROM customers
WHERE city IN ('Hyderabad', 'Mumbai')
  AND customer_name ILIKE 'a%';`) +
      sub("", "Dates: orders placed in February 2026") +
      ex("sp_shop3", `SELECT order_id, order_date, status
FROM orders
WHERE order_date >= '2026-02-01' AND order_date < '2026-03-01';`) +
      tip("for a whole month use <code>&gt;= first day</code> and <code>&lt; first day of next month</code>. It is correct for <code>DATE</code> and for <code>TIMESTAMP</code> columns, where <code>BETWEEN ... '2026-02-28'</code> would miss orders placed during the day on the 28th.") +
      sub("", "Combining conditions: delivered orders that are not from February") +
      ex("sp_shop4", `SELECT order_id, customer_id, order_date
FROM orders
WHERE status = 'Delivered'
  AND NOT (order_date BETWEEN '2026-02-01' AND '2026-02-28');`)
    )}
  `);

/* =========================================================================
   MODULE 4 (continued) — ORDER BY / LIMIT, aggregate functions, GROUP BY / HAVING
   ========================================================================= */

//# db: ord emp
topic("order-limit", "Sorting and Limiting Records", "Beginner",
  "ORDER BY (ASC, DESC, several columns, column positions, NULLS FIRST / LAST), LIMIT, OFFSET, FETCH FIRST and pagination.",
  "fa-solid fa-arrow-down-wide-short", "Sorting and Limiting Records", "Put rows in order and take only the ones you need",
  () => `
    ${section("1", "Introduction to ORDER BY",
      p("<code>ORDER BY</code> sorts the result rows. It is always the <strong>last</strong> clause of a query (before <code>LIMIT</code>).") +
      exn("or_syntax", `SELECT  columns
FROM    table_name
[WHERE  condition]
ORDER BY column [ASC | DESC], ...
[LIMIT n [OFFSET m]];`, "Syntax") +
      warn("without <code>ORDER BY</code>, PostgreSQL gives <strong>no guarantee</strong> about row order. It may look sorted today and change tomorrow. If order matters, always say so.") +
      p("Data: the <code>employees</code> table (setup script in the SELECT topic).")
    )}

    ${section("2", "Ascending order (ASC)",
      p("Smallest to largest, A to Z, oldest to newest. <code>ASC</code> is the default and can be left out.") +
      ex("or_asc", `SELECT emp_name, salary
FROM employees
ORDER BY salary ASC;`)
    )}

    ${section("3", "Descending order (DESC)",
      ex("or_desc", `SELECT emp_name, salary
FROM employees
ORDER BY salary DESC;`)
    )}

    ${section("4", "Sorting using multiple columns",
      p("When the first column has equal values, the next column breaks the tie. Each column has its own direction.") +
      ex("or_multi", `SELECT dept_id, emp_name, salary
FROM employees
ORDER BY dept_id ASC, salary DESC;`) +
      p("Departments are in ascending order; inside each department the highest salary comes first. Sara (no department) is at the end: see NULL handling below.") +
      ex("or_expr", `SELECT emp_name, salary, commission,
       salary + COALESCE(commission, 0) AS total_pay
FROM employees
ORDER BY total_pay DESC
LIMIT 4;`) +
      p("You can sort by an <strong>alias</strong> or by any <strong>expression</strong>.")
    )}

    ${section("5", "Sorting using column positions",
      p("A number refers to the position of the column in the <code>SELECT</code> list: <code>1</code> = first column.") +
      ex("or_pos", `SELECT emp_name, city, salary
FROM employees
ORDER BY 2, 3 DESC;`) +
      p("This sorts by <code>city</code>, then by <code>salary</code> descending. It is handy for quick queries; in saved code, column names are safer when the <code>SELECT</code> list changes.")
    )}

    ${section("6", "Sorting NULL values: NULLS FIRST and NULLS LAST",
      p("PostgreSQL treats <code>NULL</code> as the <strong>largest</strong> value: last in <code>ASC</code>, first in <code>DESC</code>. You can override that.") +
      ex("or_null1", `SELECT emp_name, commission FROM employees ORDER BY commission, emp_id;`, "ASC (default): NULLs last") +
      ex("or_null2", `SELECT emp_name, commission FROM employees ORDER BY commission DESC, emp_id;`, "DESC (default): NULLs first") +
      ex("or_null3", `SELECT emp_name, commission FROM employees ORDER BY commission DESC NULLS LAST, emp_id;`, "DESC with NULLS LAST")
    )}

    ${section("7", "LIMIT: restrict the number of rows",
      p("<code>LIMIT n</code> returns at most <code>n</code> rows. With <code>ORDER BY</code> it answers “top N” questions.") +
      ex("or_limit", `SELECT emp_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;`) +
      real("“Top 5 customers by revenue”, “10 most recent orders”, “3 lowest-rated products”.") +
      callout("fa-solid fa-triangle-exclamation", "<p><code>LIMIT</code> without <code>ORDER BY</code> returns <em>some</em> rows, not the <em>first</em> rows. Always sort first.</p>")
    )}

    ${section("8", "OFFSET: skip rows",
      p("<code>OFFSET m</code> skips the first <code>m</code> rows. Together: <code>LIMIT 3 OFFSET 3</code> means “skip 3, then take 3”, which is rows 4–6.") +
      ex("or_offset", `SELECT emp_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3 OFFSET 3;`)
    )}

    ${section("9", "FETCH FIRST: the SQL-standard way",
      p("<code>FETCH FIRST n ROWS ONLY</code> does the same as <code>LIMIT</code> and works in other databases such as Oracle and DB2 too.") +
      ex("or_fetch", `SELECT emp_name, salary
FROM employees
ORDER BY salary DESC
OFFSET 1 ROWS
FETCH FIRST 3 ROWS ONLY;`) +
      p("<code>WITH TIES</code> also returns rows that tie with the last one. Three employees are in department 10, so asking for 2 rows with ties returns all 3:") +
      ex("or_ties", `SELECT emp_name, dept_id
FROM employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id
FETCH FIRST 2 ROWS WITH TIES;`)
    )}

    ${section("10", "Pagination using LIMIT and OFFSET",
      p("Websites and reports show data in pages. For a page size of <code>N</code>, page <code>P</code> uses:") +
      callout("fa-solid fa-calculator", "<p><code>LIMIT N OFFSET (P - 1) * N</code></p>") +
      ex("or_page1", `-- page 1 (page size 3)
SELECT emp_id, emp_name FROM employees ORDER BY emp_id LIMIT 3 OFFSET 0;`) +
      ex("or_page2", `-- page 2
SELECT emp_id, emp_name FROM employees ORDER BY emp_id LIMIT 3 OFFSET 3;`) +
      ex("or_page3", `-- page 3 (only 2 rows left)
SELECT emp_id, emp_name FROM employees ORDER BY emp_id LIMIT 3 OFFSET 6;`) +
      tip("always sort by a <strong>unique</strong> column (or add one as the last sort key, like <code>emp_id</code>). Otherwise rows with equal values can jump between pages. For very large tables, <code>OFFSET</code> gets slow because skipped rows are still read; professionals then use “keyset pagination” (<code>WHERE emp_id &gt; last_seen_id</code>).")
    )}
  `);

//# db: agg emp
topic("aggregates", "Aggregate Functions", "Beginner",
  "COUNT, SUM, AVG, MIN, MAX, COUNT(*) vs COUNT(column), NULL handling, combining aggregates, the FILTER clause and business calculations.",
  "fa-solid fa-calculator", "Aggregate Functions", "Many rows in, one summary value out",
  () => `
    ${section("1", "What are aggregate functions?",
      p("An <strong>aggregate function</strong> reads many rows and returns <strong>one value</strong>: a count, a total, an average. They turn raw data into numbers a manager can read.") +
      table(["Function", "Returns", "Works on"], [
        [c("COUNT()"), "How many rows / values", "Any type"],
        [c("SUM()"), "Total", "Numbers"],
        [c("AVG()"), "Average (mean)", "Numbers"],
        [c("MIN()"), "Smallest value", "Numbers, text, dates"],
        [c("MAX()"), "Largest value", "Numbers, text, dates"],
      ]) +
      p("Data: the <code>employees</code> table (setup script in the SELECT topic).")
    )}

    ${section("2", "COUNT()",
      ex("ag_count", `SELECT COUNT(*) AS total_employees FROM employees;`) +
      ex("ag_count_where", `SELECT COUNT(*) AS hyderabad_staff FROM employees WHERE city = 'Hyderabad';`)
    )}

    ${section("3", "SUM(), AVG(), MIN() and MAX()",
      ex("ag_basic", `SELECT SUM(salary)            AS total_payroll,
       ROUND(AVG(salary), 2)  AS average_salary,
       MIN(salary)            AS lowest,
       MAX(salary)            AS highest
FROM employees;`) +
      p("<code>MIN</code> and <code>MAX</code> also work on dates and text:") +
      ex("ag_minmax", `SELECT MIN(hire_date) AS earliest_hire,
       MAX(hire_date) AS latest_hire,
       MIN(emp_name)  AS first_alphabetically,
       MAX(emp_name)  AS last_alphabetically
FROM employees;`)
    )}

    ${section("4", "COUNT(*) vs COUNT(column)",
      table(["Form", "Counts"], [
        [c("COUNT(*)"), "All rows, whatever the values"],
        [c("COUNT(column)"), "Rows where the column is <strong>not NULL</strong>"],
        [c("COUNT(DISTINCT column)"), "Different non-NULL values"],
      ]) +
      ex("ag_count_col", `SELECT COUNT(*)                AS all_rows,
       COUNT(commission)       AS with_commission,
       COUNT(dept_id)          AS with_department,
       COUNT(DISTINCT dept_id) AS different_departments
FROM employees;`) +
      p("Eight employees, but only 3 have a commission and 7 have a department (Sara has none). The 3 distinct department numbers are 10, 20, 30.")
    )}

    ${section("5", "Aggregate functions and NULL values",
      bullets([
        "Every aggregate except <code>COUNT(*)</code> <strong>ignores NULLs</strong>.",
        "If <em>all</em> values are NULL (or there are no rows), <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code> return NULL; <code>COUNT</code> returns 0.",
      ]) +
      ex("ag_null", `SELECT ROUND(AVG(commission), 2)               AS avg_of_those_who_have_one,
       ROUND(AVG(COALESCE(commission, 0)), 2)  AS avg_over_all_employees
FROM employees;`) +
      p("The two averages answer different questions. Decide which one the business wants, then write it explicitly.") +
      ex("ag_empty", `SELECT COUNT(*) AS rows_found, SUM(salary) AS total
FROM employees
WHERE city = 'Delhi';`)
    )}

    ${section("6", "Combining multiple aggregate functions",
      ex("ag_combo", `SELECT COUNT(*)                   AS headcount,
       SUM(salary)                AS payroll,
       ROUND(AVG(salary), 2)      AS avg_salary,
       MAX(salary) - MIN(salary)  AS salary_gap
FROM employees
WHERE dept_id = 30;`) +
      sub("", "Conditional counting with FILTER (PostgreSQL)") +
      p("<code>FILTER (WHERE ...)</code> restricts <em>one</em> aggregate to some rows, so several conditions fit in one query:") +
      ex("ag_filter", `SELECT COUNT(*) FILTER (WHERE dept_id = 10)          AS sales_staff,
       COUNT(*) FILTER (WHERE dept_id = 30)          AS it_staff,
       SUM(salary) FILTER (WHERE city = 'Hyderabad') AS hyderabad_payroll
FROM employees;`)
    )}

    ${section("7", "Two rules and two errors",
      p("<strong>Rule 1.</strong> A query that uses an aggregate cannot also show an ordinary column, because the aggregate gives one row while the column has many (unless you use <code>GROUP BY</code>, next topic):") +
      ex("ag_err1", `SELECT emp_name, MAX(salary) FROM employees;`) +
      p("<strong>Rule 2.</strong> Aggregates cannot be used in <code>WHERE</code>, because <code>WHERE</code> runs before the rows are summarised. Use a subquery or <code>HAVING</code>:") +
      ex("ag_err2", `SELECT emp_name FROM employees WHERE salary > AVG(salary);`) +
      ex("ag_fix2", `SELECT emp_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`)
    )}

    ${section("8", "Practical business calculations",
      /*# db: agshop shop */ "" +
      p("On the online-shop tables (setup script in the WHERE topic):") +
      ex("ag_shop1", `SELECT COUNT(*)               AS products,
       MIN(price)             AS cheapest,
       MAX(price)             AS most_expensive,
       ROUND(AVG(price), 2)   AS average_price
FROM products;`) +
      ex("ag_shop2", `SELECT SUM(quantity) AS units_sold, COUNT(*) AS order_lines
FROM order_items;`) +
      ex("ag_shop3", `SELECT COUNT(*) AS delivered_orders,
       MIN(order_date) AS first_delivery_order,
       MAX(order_date) AS last_delivery_order
FROM orders
WHERE status = 'Delivered';`) +
      real("the top row of every dashboard (total sales, number of customers, average order value) is an aggregate query.")
    )}
  `);

//# db: grp emp
topic("group-by", "GROUP BY and HAVING", "Intermediate",
  "Group rows with GROUP BY, summarise each group, filter groups with HAVING, WHERE vs HAVING, sort grouped results and analyse sales and employees.",
  "fa-solid fa-layer-group", "GROUP BY and HAVING", "One summary row per group",
  () => `
    ${section("1", "Introduction to GROUP BY",
      p("<code>GROUP BY</code> splits the rows into <strong>groups</strong> that share the same value, and an aggregate function then runs <em>once per group</em>. Without it, an aggregate summarises the whole table into one row.") +
      exn("gb_syntax", `SELECT   group_column, AGGREGATE(column)
FROM     table_name
[WHERE   row_condition]
GROUP BY group_column
[HAVING  group_condition]
[ORDER BY ...];`, "Syntax") +
      p("Data: <code>employees</code> (setup script in the SELECT topic) and, later, a <code>sales_data</code> table:") +
      codeBlock("Setup script (sales_data)", SETUP_SALES) +
      fig("sql_group_by.png", "Rows of employees sorted into colour-coded groups by department, then each group collapsing into a single summary row")
    )}

    ${section("2", "Grouping by one column",
      ex("gb_dept", `SELECT dept_id, COUNT(*) AS headcount
FROM employees
GROUP BY dept_id
ORDER BY dept_id;`) +
      p("Sara has no department, so <code>NULL</code> forms its own group. All NULLs are put together in <code>GROUP BY</code>.")
    )}

    ${section("3", "Aggregate functions with GROUP BY",
      ex("gb_agg", `SELECT dept_id,
       COUNT(*)               AS headcount,
       SUM(salary)            AS payroll,
       ROUND(AVG(salary), 2)  AS avg_salary,
       MAX(salary)            AS top_salary
FROM employees
GROUP BY dept_id
ORDER BY dept_id;`) +
      callout("fa-solid fa-triangle-exclamation", "<p><strong>The golden rule:</strong> every column in <code>SELECT</code> must either appear in <code>GROUP BY</code> or be inside an aggregate function.</p>") +
      ex("gb_err", `SELECT dept_id, emp_name, COUNT(*)
FROM employees
GROUP BY dept_id;`)
    )}

    ${section("4", "Grouping using multiple columns",
      p("Each different <em>combination</em> of the columns is one group.") +
      ex("gb_multi", `SELECT dept_id, city, COUNT(*) AS employees
FROM employees
GROUP BY dept_id, city
ORDER BY dept_id, city;`)
    )}

    ${section("5", "Introduction to HAVING",
      p("<code>HAVING</code> filters <strong>groups</strong> after they are built, using aggregate values. Departments with at least 2 employees:") +
      ex("gb_having1", `SELECT dept_id, COUNT(*) AS headcount
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY dept_id;`) +
      ex("gb_having2", `SELECT dept_id, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 60000
ORDER BY avg_salary DESC;`)
    )}

    ${section("6", "WHERE vs HAVING",
      table(["", "WHERE", "HAVING"], [
        ["Filters", "Individual <strong>rows</strong>", "Whole <strong>groups</strong>"],
        ["Runs", "<strong>Before</strong> grouping", "<strong>After</strong> grouping"],
        ["Can use aggregates?", "No", "Yes"],
        ["Can be used without GROUP BY?", "Yes", "Rarely"],
        ["Example", c("WHERE salary > 50000"), c("HAVING AVG(salary) > 60000")],
      ]) +
      sub("", "The logical order PostgreSQL follows") +
      numlist("", [
        ["FROM", "pick the table(s)."],
        ["WHERE", "throw away rows that fail the row condition."],
        ["GROUP BY", "form groups from the remaining rows."],
        ["HAVING", "throw away groups that fail the group condition."],
        ["SELECT", "calculate the output columns (and aliases)."],
        ["ORDER BY", "sort the result."],
        ["LIMIT / OFFSET", "cut the result."],
      ]) +
      fig("sql_query_execution_order.png", "Flow diagram of the logical order of a SQL query: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT") +
      p("That order explains the rules: a column alias cannot be used in <code>WHERE</code> or <code>HAVING</code> (<code>SELECT</code> has not run yet) but can be used in <code>ORDER BY</code>; an aggregate cannot be used in <code>WHERE</code> (groups do not exist yet).")
    )}

    ${section("7", "Filtering grouped records, with WHERE and HAVING together",
      ex("gb_both", `SELECT dept_id, COUNT(*) AS headcount, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
WHERE salary > 50000            -- rows first: ignore low earners
GROUP BY dept_id
HAVING COUNT(*) >= 2            -- then groups: need at least 2 people
ORDER BY dept_id;`)
    )}

    ${section("8", "GROUP BY with ORDER BY",
      ex("gb_order", `SELECT city, COUNT(*) AS employees, SUM(salary) AS payroll
FROM employees
GROUP BY city
ORDER BY payroll DESC;`) +
      tip("PostgreSQL lets <code>GROUP BY</code> and <code>ORDER BY</code> use output aliases or positions: <code>GROUP BY 1</code>, <code>ORDER BY 3 DESC</code>.")
    )}

    ${section("9", "GROUP BY with multiple conditions",
      ex("gb_multi_cond", `SELECT dept_id, city,
       COUNT(*)    AS employees,
       SUM(salary) AS payroll
FROM employees
WHERE hire_date >= '2019-01-01'
  AND dept_id IS NOT NULL
GROUP BY dept_id, city
HAVING SUM(salary) > 60000 AND COUNT(*) >= 1
ORDER BY payroll DESC
LIMIT 3;`)
    )}

    ${section("10", "Real-world sales and employee analysis",
      /*# db: grp2 sales */ "" +
      p("Questions from a sales manager, answered on <code>sales_data</code>:") +
      sub("", "Revenue per region") +
      ex("gb_s1", `SELECT region, COUNT(*) AS sales, SUM(amount) AS revenue
FROM sales_data
GROUP BY region
ORDER BY revenue DESC;`) +
      sub("", "Best salesperson") +
      ex("gb_s2", `SELECT salesperson, SUM(amount) AS revenue, SUM(quantity) AS units
FROM sales_data
GROUP BY salesperson
ORDER BY revenue DESC
LIMIT 3;`) +
      sub("", "Products with more than 1,00,000 revenue") +
      ex("gb_s3", `SELECT product, SUM(quantity) AS units, SUM(amount) AS revenue
FROM sales_data
GROUP BY product
HAVING SUM(amount) > 100000
ORDER BY revenue DESC;`) +
      sub("", "Region and product combination") +
      ex("gb_s4", `SELECT region, product, SUM(amount) AS revenue
FROM sales_data
GROUP BY region, product
ORDER BY region, revenue DESC;`) +
      real("monthly revenue by category, orders per customer, average basket size, attrition by department: all are <code>GROUP BY</code> queries feeding a chart or dashboard.")
    )}
  `);

/* =========================================================================
   MODULE 5 — SQL built-in functions: numeric, string, date and time
   ========================================================================= */

//# db: nf emp
topic("numeric-functions", "Numeric Functions", "Beginner",
  "FLOOR, CEIL, MOD, ROUND, TRUNC, ABS, POWER and SQRT, with practical calculations such as daily wages, compound interest and page counts.",
  "fa-solid fa-square-root-variable", "Numeric Functions", "Rounding, remainders, powers and absolute values",
  () => `
    ${section("", "What are functions?",
      p("A <strong>function</strong> takes one or more inputs, does a job, and returns a value: <code>ROUND(12.567, 1)</code> returns <code>12.6</code>. Functions can be used in <code>SELECT</code>, <code>WHERE</code>, <code>ORDER BY</code> and anywhere a value is allowed. They work <em>row by row</em>, unlike aggregate functions that summarise many rows.") +
      p("Most examples need no table at all; a few use <code>employees</code> (setup script in the SELECT topic).")
    )}

    ${section("1", "FLOOR() and CEIL() / CEILING()",
      p("<code>FLOOR</code> rounds <strong>down</strong> to the nearest whole number, <code>CEIL</code> rounds <strong>up</strong>. Watch the negative numbers: “down” means towards minus infinity.") +
      ex("nf_floor", `SELECT FLOOR(7.8)  AS floor_pos,
       CEIL(7.2)   AS ceil_pos,
       FLOOR(-7.2) AS floor_neg,
       CEIL(-7.8)  AS ceil_neg;`) +
      real("pages needed to show 47 rows with 10 per page. Integer division loses the remainder, so make one side decimal:") +
      ex("nf_pages", `SELECT 47 / 10            AS wrong_pages,
       CEIL(47 / 10.0)     AS pages_needed;`)
    )}

    ${section("2", "MOD()",
      p("<code>MOD(a, b)</code> (or <code>a % b</code>) is the remainder after division. Typical uses: even / odd tests, cycles, every n-th row.") +
      ex("nf_mod", `SELECT MOD(17, 5) AS remainder, 17 % 5 AS same_thing, MOD(-17, 5) AS negative_input;`) +
      ex("nf_mod2", `SELECT emp_id, emp_name,
       CASE WHEN MOD(emp_id, 2) = 0 THEN 'even' ELSE 'odd' END AS id_type
FROM employees
ORDER BY emp_id
LIMIT 4;`)
    )}

    ${section("3", "ROUND()",
      p("<code>ROUND(x)</code> rounds to a whole number, <code>ROUND(x, n)</code> to <code>n</code> decimals. A <strong>negative</strong> <code>n</code> rounds to tens, hundreds…") +
      ex("nf_round", `SELECT ROUND(1234.5678)      AS to_integer,
       ROUND(1234.5678, 2)   AS two_decimals,
       ROUND(1234.5678, -2)  AS nearest_hundred,
       ROUND(2.5)            AS numeric_half,
       ROUND(2.5::double precision) AS float_half;`) +
      note("Detail:", "for <code>NUMERIC</code> a half is rounded <em>away from zero</em> (2.5 → 3). For <code>DOUBLE PRECISION</code>, the machine’s rule “round half to even” applies (2.5 → 2). Money should be <code>NUMERIC</code>.") +
      p("<code>ROUND(x, n)</code> with a decimal argument needs a <code>NUMERIC</code> value; cast if necessary: <code>ROUND(x::numeric, 2)</code>.")
    )}

    ${section("4", "TRUNC()",
      p("<code>TRUNC</code> simply <strong>cuts off</strong> digits, without rounding.") +
      ex("nf_trunc", `SELECT TRUNC(1234.5678)     AS cut_to_integer,
       TRUNC(1234.5678, 2)  AS cut_to_2,
       ROUND(1234.5678, 2)  AS rounded_to_2,
       TRUNC(-7.9)          AS toward_zero;`)
    )}

    ${section("5", "ABS()",
      p("<code>ABS</code> returns the absolute value (distance from zero): handy for differences where the sign does not matter.") +
      ex("nf_abs", `SELECT ABS(-250) AS abs_value,
       ABS(55000 - 62000) AS salary_gap;`)
    )}

    ${section("6", "POWER() and SQRT()",
      ex("nf_power", `SELECT POWER(2, 10) AS two_to_the_10,
       POWER(9, 0.5) AS square_root_via_power,
       SQRT(144)     AS sqrt_144,
       ROUND(SQRT(2)::numeric, 4) AS sqrt_2;`)
    )}

    ${section("7", "Practical numerical calculations",
      sub("", "Daily wage and rounded monthly bonus") +
      ex("nf_prac1", `SELECT emp_name,
       salary,
       ROUND(salary / 30, 2)          AS daily_wage,
       ROUND(salary * 0.075, -1)      AS bonus_nearest_10
FROM employees
WHERE dept_id = 10
ORDER BY emp_id;`) +
      sub("", "Compound interest: ₹1,00,000 at 8% for 5 years") +
      ex("nf_prac2", `SELECT ROUND(100000 * POWER(1 + 0.08, 5), 2) AS maturity_amount;`) +
      sub("", "Salary bands with FLOOR") +
      ex("nf_prac3", `SELECT emp_name, salary,
       FLOOR(salary / 10000) * 10000 AS band_start
FROM employees
ORDER BY salary DESC
LIMIT 4;`)
    )}
  `);

//# db: sf
topic("string-functions", "String Functions", "Beginner",
  "UPPER, LOWER, CONCAT, LENGTH, TRIM, LTRIM, RTRIM, LPAD, RPAD, SUBSTRING, POSITION, REPLACE, REVERSE and INITCAP, applied to cleaning messy text.",
  "fa-solid fa-font", "String Functions", "Clean, cut, join and reshape text",
  () => `
    ${section("", "The messy data we will clean",
      p("Real data is dirty: extra spaces, wrong capitals, phone numbers with dashes. These functions are the cleaning tools.") +
      ex("sf_setup", `CREATE TABLE raw_customers (
    id        INTEGER,
    full_name TEXT,
    email     TEXT,
    phone     TEXT
);

INSERT INTO raw_customers VALUES
    (1, '  aLI kHAN ',   'ALI.KHAN@Example.COM',     '98765-43210'),
    (2, 'ayesha   RAO',  'Ayesha.Rao@example.com ',  '98123 45678'),
    (3, 'RAVI kumar',    'ravi.kumar@EXAMPLE.com',   '91234-56780');

SELECT * FROM raw_customers ORDER BY id;`)
    )}

    ${section("1", "UPPER() and LOWER()",
      ex("sf_case", `SELECT UPPER('Hyderabad') AS upper_case,
       LOWER('SQL Course') AS lower_case,
       LOWER(email)        AS clean_email
FROM raw_customers
WHERE id = 1;`) +
      tip("compare text case-insensitively with <code>WHERE LOWER(email) = 'ali.khan@example.com'</code> (or <code>ILIKE</code>).")
    )}

    ${section("2", "CONCAT()",
      ex("sf_concat", `SELECT CONCAT('SQL', ' ', 'Course', ' ', 2026)       AS joined,
       CONCAT('Name: ', NULL, 'Ali')                     AS null_is_skipped,
       'Name: ' || NULL || 'Ali'                         AS null_with_pipes;`)
    )}

    ${section("3", "LENGTH()",
      p("<code>LENGTH</code> counts <strong>characters</strong> (<code>CHAR_LENGTH</code> is the same). <code>OCTET_LENGTH</code> counts bytes.") +
      ex("sf_length", `SELECT LENGTH('Hyderabad')    AS letters,
       LENGTH('₹100')        AS chars,
       OCTET_LENGTH('₹100')  AS bytes,
       full_name, LENGTH(full_name) AS length_with_spaces
FROM raw_customers
WHERE id = 1;`)
    )}

    ${section("4", "TRIM(), LTRIM() and RTRIM()",
      p("Remove spaces (or other characters) from the ends of a text. <code>LTRIM</code> works on the left, <code>RTRIM</code> on the right, <code>TRIM</code> on both.") +
      ex("sf_trim", `SELECT '[' || TRIM('   SQL   ')  || ']' AS both_sides,
       '[' || LTRIM('   SQL   ') || ']' AS left_only,
       '[' || RTRIM('   SQL   ') || ']' AS right_only,
       TRIM(BOTH 'x' FROM 'xxSQLxx')   AS other_character;`) +
      p("<code>TRIM</code> removes only the ends. Spaces <em>inside</em> a text, like in “ayesha   RAO”, need <code>REGEXP_REPLACE</code> (below).")
    )}

    ${section("5", "LPAD() and RPAD()",
      p("Pad a text to a fixed length by adding characters on the left or right. If the text is longer, it is <em>cut</em> to that length.") +
      ex("sf_pad", `SELECT LPAD(id::text, 5, '0')           AS invoice_no,
       RPAD(full_name, 14, '.')          AS dotted,
       'INV-' || LPAD(id::text, 4, '0')  AS invoice_code
FROM raw_customers
ORDER BY id;`)
    )}

    ${section("6", "SUBSTRING() / SUBSTR(), LEFT() and RIGHT()",
      p("Extract part of a text. Positions start at <strong>1</strong>.") +
      ex("sf_substr", `SELECT SUBSTRING('Hyderabad' FROM 1 FOR 3)  AS first_three,
       SUBSTRING('Hyderabad', 4, 3)         AS from_4th_take_3,
       SUBSTR('Hyderabad', 5)               AS from_5th_to_end,
       LEFT('Hyderabad', 4)                 AS left_4,
       RIGHT('Hyderabad', 4)                AS right_4;`) +
      ex("sf_mask", `SELECT phone,
       LEFT(REPLACE(REPLACE(phone, '-', ''), ' ', ''), 2) || 'XXXXXX' ||
       RIGHT(REPLACE(REPLACE(phone, '-', ''), ' ', ''), 2) AS masked
FROM raw_customers
ORDER BY id;`)
    )}

    ${section("7", "POSITION() / STRPOS()",
      p("Find where a text appears. The result is the position (1-based), or <code>0</code> if absent.") +
      ex("sf_position", `SELECT POSITION('@' IN email)   AS at_position,
       STRPOS(email, '.')       AS first_dot,
       SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain
FROM raw_customers
WHERE id = 3;`) +
      p("A shortcut for splitting is <code>SPLIT_PART(text, delimiter, n)</code>:") +
      ex("sf_split", `SELECT SPLIT_PART('ravi.kumar@example.com', '@', 1) AS user_name,
       SPLIT_PART('ravi.kumar@example.com', '@', 2) AS domain;`)
    )}

    ${section("8", "REPLACE() and REVERSE()",
      ex("sf_replace", `SELECT REPLACE('98765-43210', '-', '')  AS phone_digits,
       REPLACE('Data Science', 'Science', 'Analytics') AS replaced,
       REVERSE('SQL')                    AS reversed;`)
    )}

    ${section("9", "INITCAP()",
      p("Capitalises the first letter of every word and lower-cases the rest: perfect for names.") +
      ex("sf_initcap", `SELECT INITCAP('ravi kumar')    AS name_1,
       INITCAP('MEENA IYER')    AS name_2,
       INITCAP('hello-world sql') AS note;`)
    )}

    ${section("10", "Practical text cleaning and formatting",
      p("Chain the functions: the result of one is the input of the next, working from the inside out.") +
      ex("sf_clean", `SELECT id,
       INITCAP(REGEXP_REPLACE(TRIM(full_name), '[ ]+', ' ', 'g'))  AS full_name,
       LOWER(TRIM(email))                                          AS email,
       REPLACE(REPLACE(phone, '-', ''), ' ', '')                   AS phone
FROM raw_customers
ORDER BY id;`) +
      p("Then save the cleaned version, so it never needs cleaning again:") +
      ex("sf_update", `UPDATE raw_customers
SET full_name = INITCAP(REGEXP_REPLACE(TRIM(full_name), '[ ]+', ' ', 'g')),
    email     = LOWER(TRIM(email)),
    phone     = REPLACE(REPLACE(phone, '-', ''), ' ', '');

SELECT * FROM raw_customers ORDER BY id;`) +
      real("every import project starts with this routine: trim, fix capitals, strip formatting, then check for duplicates.")
    )}
  `);

//# db: df emp
topic("datetime-functions", "Date and Time Functions", "Intermediate",
  "CURRENT_DATE, NOW(), AGE(), EXTRACT(), DATE_PART(), DATE_TRUNC(), TO_DATE(), TO_CHAR(), date arithmetic, intervals, employee experience and monthly or yearly reports.",
  "fa-solid fa-calendar-days", "Date and Time Functions", "Work with dates, ages, intervals and reports by month",
  () => `
    ${section("1", "Understanding DATE and TIME",
      p("Dates and times are stored as proper types, not text, so PostgreSQL can do calendar maths on them.") +
      table(["Type", "Example", "Use"], [
        [c("DATE"), c("2026-11-06"), "Birthdays, hire dates, order dates"],
        [c("TIME"), c("14:30:00"), "Opening hours"],
        [c("TIMESTAMP"), c("2026-11-06 14:30:00"), "Exact moment, no zone"],
        [c("TIMESTAMPTZ"), c("2026-11-06 14:30:00+05:30"), "Exact moment with zone (best for events)"],
        [c("INTERVAL"), c("3 months 2 days"), "A length of time"],
      ]) +
      p("Data: <code>employees</code> (hire dates) and <code>sales_data</code>. In the examples below the “today” is fixed as <code>2026-11-06</code> so that results are reproducible; use <code>CURRENT_DATE</code> to get the real today.")
    )}

    ${section("2", "CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP and NOW()",
      exo("df_now", `SELECT CURRENT_DATE      AS today,
       CURRENT_TIME      AS time_now,
       CURRENT_TIMESTAMP AS timestamp_now,
       NOW()             AS now_function;`, ` today     |    time_now     |         timestamp_now         |         now_function
------------+-----------------+-------------------------------+-------------------------------
 2026-11-06 | 14:32:10.481+05 | 2026-11-06 14:32:10.481+05:30 | 2026-11-06 14:32:10.481+05:30
(1 row)`) +
      bullets([
        "The output depends on the moment you run it and your time zone.",
        "<code>NOW()</code> and <code>CURRENT_TIMESTAMP</code> are the same: the time the <em>transaction</em> started. <code>CURRENT_DATE</code> is just the date.",
        "<code>CURRENT_DATE</code> and <code>NOW()</code> are often used as column defaults: <code>order_date DATE DEFAULT CURRENT_DATE</code>.",
      ])
    )}

    ${section("3", "AGE()",
      p("<code>AGE(later, earlier)</code> gives the difference as years, months and days. With one argument it measures from today.") +
      ex("df_age", `SELECT AGE(DATE '2026-11-06', DATE '1995-05-15') AS age_of_person,
       AGE(DATE '2026-11-06', DATE '2023-06-01') AS time_since_joining;`) +
      exn("df_age2", `SELECT AGE(DATE '1995-05-15');   -- age as of today`, "One argument")
    )}

    ${section("4", "EXTRACT() and DATE_PART()",
      p("Pull one piece (year, month, day, week, weekday …) out of a date. <code>EXTRACT(field FROM date)</code> is the standard form; <code>DATE_PART('field', date)</code> does the same.") +
      ex("df_extract", `SELECT hire_date,
       EXTRACT(YEAR  FROM hire_date)  AS year,
       EXTRACT(MONTH FROM hire_date)  AS month,
       EXTRACT(DAY   FROM hire_date)  AS day,
       EXTRACT(DOW   FROM hire_date)  AS weekday_0_is_sunday,
       DATE_PART('quarter', hire_date) AS quarter
FROM employees
WHERE emp_id = 101;`) +
      ex("df_extract_where", `SELECT emp_name, hire_date
FROM employees
WHERE EXTRACT(YEAR FROM hire_date) = 2023
ORDER BY hire_date;`)
    )}

    ${section("5", "DATE_TRUNC()",
      p("<code>DATE_TRUNC('unit', date)</code> cuts a date down to the <strong>start</strong> of the month, year, week, quarter … It is the key to grouping by period.") +
      ex("df_trunc", `SELECT DATE '2026-11-06' AS original,
       DATE_TRUNC('month',   DATE '2026-11-06')::date AS month_start,
       DATE_TRUNC('quarter', DATE '2026-11-06')::date AS quarter_start,
       DATE_TRUNC('year',    DATE '2026-11-06')::date AS year_start,
       DATE_TRUNC('week',    DATE '2026-11-06')::date AS monday_of_week;`)
    )}

    ${section("6", "TO_DATE() and TO_CHAR()",
      p("<code>TO_DATE(text, format)</code> converts text to a date. <code>TO_CHAR(value, format)</code> converts a date or number to formatted text.") +
      table(["Format code", "Meaning", "Example"], [
        [c("YYYY") + " / " + c("YY"), "Year", "2026 / 26"],
        [c("MM") + " / " + c("Mon") + " / " + c("Month"), "Month number / short / full name", "11 / Nov / November"],
        [c("DD") + " / " + c("Dy") + " / " + c("Day"), "Day number / short / full weekday", "06 / Fri / Friday"],
        [c("HH24:MI:SS"), "24-hour time", "14:30:00"],
        [c("FM"), "Fill mode prefix: removes padding / leading zeros", c("FMDD") + " → 6"],
      ]) +
      ex("df_todate", `SELECT TO_DATE('15/08/2026', 'DD/MM/YYYY')  AS from_dd_mm_yyyy,
       TO_DATE('March 5, 2026', 'Month DD, YYYY') AS from_words;`) +
      ex("df_tochar", `SELECT TO_CHAR(DATE '2026-11-06', 'DD-Mon-YYYY')         AS style_1,
       TO_CHAR(DATE '2026-11-06', 'FMDay, FMDD FMMonth YYYY') AS style_2,
       TO_CHAR(DATE '2026-11-06', 'YYYY-MM')                  AS year_month,
       TO_CHAR(55000, 'FM99,999,999.00')                       AS formatted_number;`) +
      warn("<code>TO_DATE('15/08/2026')</code> without a format guesses, and the guess depends on the <code>DateStyle</code> setting. Always give the format.")
    )}

    ${section("7", "Date arithmetic and interval calculations",
      table(["Expression", "Result type", "Meaning"], [
        [c("date + integer"), "date", "Add days"],
        [c("date - integer"), "date", "Subtract days"],
        [c("date - date"), "integer", "Number of days between"],
        [c("date + INTERVAL '3 months'"), "timestamp", "Add a period (cast with " + c("::date") + " to drop the time)"],
      ]) +
      ex("df_arith", `SELECT DATE '2026-11-06' + 30                        AS plus_30_days,
       DATE '2026-11-06' - DATE '2026-01-01'          AS days_this_year,
       (DATE '2026-11-06' + INTERVAL '3 months')::date AS plus_3_months,
       (DATE '2026-01-31' + INTERVAL '1 month')::date  AS end_of_month_case;`) +
      ex("df_due", `-- invoices due 45 days after the order
SELECT order_date, order_date + 45 AS due_date
FROM (VALUES (DATE '2026-01-05'), (DATE '2026-02-14')) AS t(order_date);`)
    )}

    ${section("8", "Finding employee experience",
      ex("df_exp", `SELECT emp_name,
       hire_date,
       AGE(DATE '2026-11-06', hire_date)                         AS service,
       EXTRACT(YEAR FROM AGE(DATE '2026-11-06', hire_date))      AS full_years
FROM employees
ORDER BY hire_date
LIMIT 5;`) +
      ex("df_exp2", `SELECT emp_name, hire_date
FROM employees
WHERE AGE(DATE '2026-11-06', hire_date) >= INTERVAL '5 years'
ORDER BY hire_date;`) +
      tip("in real queries replace <code>DATE '2026-11-06'</code> by <code>CURRENT_DATE</code>.")
    )}

    ${section("9", "Calculating age and duration",
      ex("df_dur", `SELECT DATE '2026-12-25' - DATE '2026-11-06'                    AS days_to_christmas,
       ROUND((DATE '2026-12-25' - DATE '2026-11-06') / 7.0, 1)  AS weeks,
       EXTRACT(YEAR FROM AGE(DATE '2026-11-06', DATE '2000-02-29')) AS age_in_years;`) +
      ex("df_dur2", `SELECT TIMESTAMP '2026-11-06 18:30' - TIMESTAMP '2026-11-06 09:15' AS worked,
       EXTRACT(EPOCH FROM (TIMESTAMP '2026-11-06 18:30' - TIMESTAMP '2026-11-06 09:15')) / 3600 AS hours;`)
    )}

    ${section("10", "Monthly and yearly business reports",
      /*# db: df2 sales */ "" +
      p("<code>DATE_TRUNC</code> and <code>TO_CHAR</code> turn raw dates into report periods. On <code>sales_data</code> (setup script in the GROUP BY topic):") +
      ex("df_month", `SELECT DATE_TRUNC('month', sale_date)::date AS month,
       COUNT(*)        AS sales,
       SUM(amount)     AS revenue
FROM sales_data
GROUP BY DATE_TRUNC('month', sale_date)
ORDER BY month;`) +
      ex("df_month2", `SELECT TO_CHAR(sale_date, 'YYYY-MM') AS month,
       region,
       SUM(amount) AS revenue
FROM sales_data
GROUP BY TO_CHAR(sale_date, 'YYYY-MM'), region
HAVING SUM(amount) >= 60000
ORDER BY month, region;`) +
      ex("df_year", `SELECT EXTRACT(YEAR FROM sale_date) AS year,
       EXTRACT(QUARTER FROM sale_date) AS quarter,
       SUM(amount) AS revenue
FROM sales_data
GROUP BY 1, 2
ORDER BY 1, 2;`) +
      real("month-on-month growth, quarterly targets, “sales this year so far”: all start from one of these three patterns.")
    )}
  `);

/* =========================================================================
   MODULE 6 — Set operations
   MODULE 7 — Joins
   ========================================================================= */

//# db: setops
topic("set-operations", "Combining Query Results (Set Operations)", "Intermediate",
  "UNION, UNION ALL, INTERSECT and EXCEPT: compatible SELECTs, differences between the operators, ORDER BY with set operations and examples on employee and customer lists.",
  "fa-solid fa-object-group", "Combining Query Results", "UNION, UNION ALL, INTERSECT and EXCEPT",
  () => `
    ${section("1", "Introduction to set operations",
      p("A join puts tables <strong>side by side</strong> (more columns). A <strong>set operation</strong> stacks the results of two queries <strong>on top of each other</strong> (more rows), the way sets work in mathematics.") +
      fig("sql_set_operations.png", "Four Venn diagrams for UNION, UNION ALL, INTERSECT and EXCEPT showing which part of circles A and B is returned") +
      table(["Operator", "Returns", "Duplicates"], [
        [c("UNION"), "Rows from A <em>or</em> B", "Removed"],
        [c("UNION ALL"), "All rows of A plus all rows of B", "Kept"],
        [c("INTERSECT"), "Rows that appear in <em>both</em> A and B", "Removed"],
        [c("EXCEPT"), "Rows of A that are <em>not</em> in B", "Removed"],
      ]) +
      p("Practice data: two lists of people, one of employees and one of customers (some people are both):") +
      ex("so_setup", `CREATE TABLE emp_list  (person_name VARCHAR(30), city VARCHAR(30));
CREATE TABLE cust_list (person_name VARCHAR(30), city VARCHAR(30));

INSERT INTO emp_list VALUES
    ('Ali Khan',     'Hyderabad'),
    ('Ayesha Rao',   'Hyderabad'),
    ('Ravi Kumar',   'Bengaluru'),
    ('Priya Sharma', 'Mumbai');

INSERT INTO cust_list VALUES
    ('Ayesha Rao',   'Hyderabad'),
    ('Ravi Kumar',   'Bengaluru'),
    ('John Mathew',  'Chennai'),
    ('John Mathew',  'Chennai'),
    ('Meena Iyer',   'Chennai');`)
    )}

    ${section("2", "Compatibility of SELECT statements",
      p("The two queries must be <strong>union-compatible</strong>:") +
      bullets([
        "the <strong>same number of columns</strong>,",
        "<strong>compatible data types</strong> in the same positions (text with text, numbers with numbers),",
        "the <strong>column names</strong> of the final result come from the <em>first</em> query.",
      ]) +
      ex("so_err", `SELECT person_name, city FROM emp_list
UNION
SELECT person_name FROM cust_list;`)
    )}

    ${section("3", "UNION",
      p("Everyone who is an employee or a customer, each different row once:") +
      ex("so_union", `SELECT person_name, city FROM emp_list
UNION
SELECT person_name, city FROM cust_list
ORDER BY person_name;`) +
      p("Ayesha and Ravi (in both lists) appear once, and John (twice in the customer list) appears once.")
    )}

    ${section("4", "UNION ALL",
      ex("so_unionall", `SELECT person_name, city FROM emp_list
UNION ALL
SELECT person_name, city FROM cust_list
ORDER BY person_name;`) +
      sub("", "Difference between UNION and UNION ALL") +
      table(["", "UNION", "UNION ALL"], [
        ["Duplicates", "Removed", "Kept"],
        ["Speed", "Slower: must sort or hash to find duplicates", "Faster"],
        ["Rows here", "6", "9"],
        ["Use when", "You need a distinct list", "Rows cannot overlap, or you want every row (e.g. monthly tables stacked together)"],
      ]) +
      tip("use <code>UNION ALL</code> by default; add <code>UNION</code> only when you really need duplicates removed.")
    )}

    ${section("5", "INTERSECT",
      p("People who are <strong>both</strong> an employee and a customer:") +
      ex("so_intersect", `SELECT person_name, city FROM emp_list
INTERSECT
SELECT person_name, city FROM cust_list
ORDER BY person_name;`)
    )}

    ${section("6", "EXCEPT",
      p("<code>EXCEPT</code> is PostgreSQL's (and the standard's) name for what Oracle calls <code>MINUS</code>. Employees who are <strong>not</strong> customers:") +
      ex("so_except", `SELECT person_name, city FROM emp_list
EXCEPT
SELECT person_name, city FROM cust_list
ORDER BY person_name;`) +
      p("The order matters. Reversing it gives the customers who are not employees:") +
      ex("so_except2", `SELECT person_name, city FROM cust_list
EXCEPT
SELECT person_name, city FROM emp_list
ORDER BY person_name;`) +
      sub("", "Difference between INTERSECT and EXCEPT") +
      table(["", "INTERSECT", "EXCEPT"], [
        ["Returns", "Rows common to both", "Rows only in the first"],
        ["Order of queries", "Does not matter (A ∩ B = B ∩ A)", "Matters (A − B ≠ B − A)"],
      ])
    )}

    ${section("7", "ORDER BY with set operations",
      bullets([
        "<code>ORDER BY</code> goes <strong>once, at the very end</strong>, and sorts the combined result.",
        "It can use only the <strong>column names (or positions) of the first query</strong>.",
        "To sort one part separately, put that query in brackets with its own <code>ORDER BY ... LIMIT</code>.",
      ]) +
      ex("so_label", `SELECT person_name, 'employee' AS source FROM emp_list
UNION ALL
SELECT person_name, 'customer' FROM cust_list
ORDER BY source, person_name;`) +
      note("Precedence:", "<code>INTERSECT</code> binds tighter than <code>UNION</code> and <code>EXCEPT</code>. Use brackets when mixing operators so the intention is clear.")
    )}

    ${section("8", "Practical examples",
      real("a mailing list from several sources: <code>UNION</code> removes people listed twice. “Customers who bought in January but not in February” is an <code>EXCEPT</code>. “Customers who bought both products A and B” is an <code>INTERSECT</code>.") +
      ex("so_prac", `-- every city where we have either an employee or a customer
SELECT city FROM emp_list
UNION
SELECT city FROM cust_list
ORDER BY city;`)
    )}
  `);

//# db: rel emp
topic("join-relationships", "Table Relationships and Why We Join", "Beginner",
  "Why data is split across tables, primary and foreign keys in relationships, one-to-one, one-to-many and many-to-many relationships, and what “matching records” means.",
  "fa-solid fa-diagram-project", "Understanding Relationships", "Why we need joins",
  () => `
    ${section("19.1", "Why do we need joins?",
      p("Good databases store each fact <strong>once</strong>. The department name “Sales” is stored in <code>departments</code>; employees only store the department <em>number</em>. That avoids duplicates and typing mistakes, but a query on <code>employees</code> alone shows only numbers:") +
      ex("jr_ids", `SELECT emp_name, dept_id
FROM employees
WHERE emp_id <= 104
ORDER BY emp_id;`) +
      p("Which department is <code>30</code>? To show the name you must <strong>join</strong> the tables: a join combines rows from two or more tables using related columns.") +
      p("Data: <code>employees</code>, <code>departments</code> (setup script in the SELECT topic) and the shop tables (setup script in the WHERE topic).")
    )}

    ${section("2", "Understanding related tables",
      p("Tables are connected by <strong>key columns</strong>:") +
      table(["Table", "Key", "Role"], [
        [c("departments"), c("dept_id") + " (primary key)", "The “one” side: each department appears once"],
        [c("employees"), c("dept_id") + " (foreign key)", "The “many” side: many employees can share one dept_id"],
      ]) +
      fig("sql_table_relationship.png", "Two tables employees and departments with an arrow from employees.dept_id (foreign key) to departments.dept_id (primary key)")
    )}

    ${section("3", "Primary Key and Foreign Key in table relationships",
      bullets([
        "The <strong>primary key</strong> identifies a row in its own table.",
        "The <strong>foreign key</strong> stores that identifier in another table, building the relationship, and the database refuses a value that has no match (referential integrity).",
        "A join condition normally says: <code>child.foreign_key = parent.primary_key</code>.",
      ])
    )}

    ${section("4", "Types of relationships",
      fig("sql_relationship_types.png", "Entity-relationship sketches of one-to-one, one-to-many and many-to-many relationships with crow's foot notation") +
      sub("1.", "One-to-One (1:1)") +
      p("One row in A matches at most one row in B. Example: each employee has one profile with sensitive details kept in a separate table. Making the foreign key also the primary key enforces it:") +
      ex("jr_121", `CREATE TABLE employee_profiles (
    emp_id   INTEGER PRIMARY KEY REFERENCES employees (emp_id),
    pan_no   VARCHAR(10),
    blood_group VARCHAR(3)
);

INSERT INTO employee_profiles VALUES (101, 'ABCDE1234F', 'B+'), (102, 'PQRST5678K', 'O+');`) +
      sub("2.", "One-to-Many (1:N), the most common") +
      p("One row in A matches many rows in B. One department has many employees; one customer places many orders; one order contains many order lines. The foreign key lives on the “many” side.") +
      sub("3.", "Many-to-Many (M:N)") +
      p("Many rows in A match many rows in B. An order contains many products and a product appears in many orders. A relational database cannot store that directly. It uses a <strong>junction (bridge) table</strong> holding two foreign keys, one for each side. In the shop, <code>order_items</code> is that bridge:") +
      /*# db: rel2 shop */ "" +
      ex("jr_mm", `SELECT item_id, order_id, product_id, quantity
FROM order_items
WHERE order_id IN (1001, 1006)
ORDER BY item_id;`) +
      p("Order 1001 has products 1 and 3; order 1006 has products 1 and 4. Product 1 appears in both orders, which is exactly the many-to-many relationship.")
    )}

    ${section("5", "Understanding matching records",
      p("A join pairs a row from one table with a row from the other <strong>when the join condition is true</strong>. Rows that find a partner are <em>matching</em> records; rows that do not are <em>unmatched</em>.") +
      fig("sql_matching_records.png", "Two small tables with lines drawn between rows that share the same dept_id; one employee and one department have no line (unmatched)") +
      table(["", "Matching", "Unmatched"], [
        ["employees", "Ali (dept 10), Ravi (dept 30) …", "Sara Fernandes: dept_id is NULL"],
        ["departments", "Sales, HR, IT", "Finance: no employee works there"],
      ]) +
      p("The type of join you choose decides what happens to unmatched rows. That is the topic of the next page.")
    )}
  `);

//# db: jt emp
topic("join-types", "Types of Joins", "Intermediate",
  "INNER, LEFT, RIGHT, FULL OUTER, CROSS and SELF joins, with the same employee and department data so the differences are easy to see.",
  "fa-solid fa-code-merge", "Types of Joins", "INNER, LEFT, RIGHT, FULL, CROSS and SELF",
  () => `
    ${section("19.2", "Join types at a glance",
      fig("sql_join_types.png", "Venn diagrams for INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL OUTER JOIN with the returned area shaded") +
      table(["Join", "Returns"], [
        [c("INNER JOIN"), "Only rows that match in <strong>both</strong> tables"],
        [c("LEFT JOIN"), "All rows of the <strong>left</strong> table, plus matches from the right (NULL where none)"],
        [c("RIGHT JOIN"), "All rows of the <strong>right</strong> table, plus matches from the left (NULL where none)"],
        [c("FULL OUTER JOIN"), "All rows of <strong>both</strong>; NULL where there is no match"],
        [c("CROSS JOIN"), "Every row of A with every row of B (no condition)"],
        [c("SELF JOIN"), "A table joined to itself (using two aliases)"],
      ]) +
      p("To see the differences, remember the data: <strong>Sara</strong> has no department, and the <strong>Finance</strong> department (40) has no employees.") +
      exn("jt_tables", `employees:   101 Ali (10) · 102 Ayesha (10) · 103 Ravi (30) · 104 John (30)
             105 Priya (20) · 106 Meena (30) · 107 Karan (10) · 108 Sara (NULL)
departments: 10 Sales · 20 HR · 30 IT · 40 Finance`, "Data in brief")
    )}

    ${section("1", "INNER JOIN",
      ex("jt_inner", `SELECT e.emp_id, e.emp_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.emp_id;`) +
      p("Seven rows: Sara (no department) and Finance (no employees) are both missing. <code>JOIN</code> alone means <code>INNER JOIN</code>.")
    )}

    ${section("2", "LEFT JOIN (LEFT OUTER JOIN)",
      p("Keeps <strong>all employees</strong>, matched or not:") +
      ex("jt_left", `SELECT e.emp_id, e.emp_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
ORDER BY e.emp_id;`) +
      p("Sara appears, with <code>NULL</code> where the department columns should be. Use this when the left table is the “main” list and the right table only adds extra information.")
    )}

    ${section("3", "RIGHT JOIN (RIGHT OUTER JOIN)",
      p("Keeps <strong>all departments</strong>:") +
      ex("jt_right", `SELECT d.dept_name, e.emp_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id
ORDER BY d.dept_id, e.emp_id;`) +
      p("Finance appears with no employee. A <code>RIGHT JOIN</code> is just a <code>LEFT JOIN</code> with the tables swapped; most people always write <code>LEFT JOIN</code> and reorder the tables, to keep queries easier to read.")
    )}

    ${section("4", "FULL OUTER JOIN",
      p("Keeps <strong>everything</strong> from both sides:") +
      ex("jt_full", `SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id
WHERE e.emp_id IS NULL OR d.dept_id IS NULL;`) +
      p("The <code>WHERE</code> keeps only the <em>unmatched</em> rows from both sides: Sara (no department) and Finance (no employee). That is a classic data-quality check.")
    )}

    ${section("5", "CROSS JOIN",
      p("Pairs <strong>every</strong> row of the first table with <strong>every</strong> row of the second. No <code>ON</code> clause. Rows = rows(A) × rows(B).") +
      ex("jt_cross", `SELECT d.dept_name, s.shift
FROM departments d
CROSS JOIN (VALUES ('Morning'), ('Evening')) AS s(shift)
ORDER BY d.dept_id, s.shift;`) +
      p("4 departments × 2 shifts = 8 rows. Good for building a full schedule or a calendar grid. Dangerous by accident: if you forget the join condition, two tables of 10,000 rows give 100 million rows.") +
      callout("fa-solid fa-triangle-exclamation", "<p>An old style, <code>FROM employees, departments</code> with no <code>WHERE</code>, silently creates a cross join. Always use explicit <code>JOIN ... ON</code>.</p>")
    )}

    ${section("6", "SELF JOIN",
      p("A table can be joined to <strong>itself</strong>. It needs two different aliases so PostgreSQL can tell the two copies apart. In <code>employees</code>, <code>manager_id</code> points to another row of the same table:") +
      ex("jt_self", `SELECT e.emp_name  AS employee,
       m.emp_name  AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id
ORDER BY e.emp_id;`) +
      p("Ali has no manager (<code>manager_id</code> is NULL), so a <code>LEFT JOIN</code> is used to keep him.") +
      real("organisation charts, product categories and sub-categories, “who referred whom”, bill-of-materials trees.")
    )}

    ${section("", "Which join should I use?",
      table(["Question", "Join"], [
        ["Show only things that have a partner (employees with a department)", c("INNER JOIN")],
        ["Show all of A, with B’s information if it exists (all customers, with their orders if any)", c("LEFT JOIN")],
        ["Find items in A that have no partner in B (customers who never ordered)", c("LEFT JOIN ... WHERE b.key IS NULL")],
        ["Reconcile two lists and see what is missing on either side", c("FULL OUTER JOIN")],
        ["Generate all combinations", c("CROSS JOIN")],
        ["Compare rows of one table with other rows of the same table", c("SELF JOIN")],
      ])
    )}
  `);

//# db: ja shop
topic("join-advanced", "Advanced Join Concepts", "Intermediate",
  "Joining two, three and more tables, multiple join conditions, ON vs USING, joins with WHERE, handling unmatched records, self-join applications and real-world customer, order and employee examples.",
  "fa-solid fa-link", "Advanced Join Concepts", "Multi-table joins and real business questions",
  () => `
    ${section("19.3", "Joining two tables with aliases",
      p("Data: the shop tables. Run the setup script (WHERE topic) once.") +
      ex("ja_two", `SELECT o.order_id, c.customer_name, o.order_date, o.status
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
ORDER BY o.order_id;`) +
      tip("always prefix columns with the table alias (<code>o.order_id</code>). It is required when a name exists in both tables, and it makes queries easier to read.")
    )}

    ${section("2", "Joining three or more tables",
      p("Chain the joins: each new <code>JOIN</code> connects to a table already in the query. Orders → customers, order lines, products:") +
      ex("ja_three", `SELECT o.order_id,
       c.customer_name,
       p.product_name,
       oi.quantity,
       p.price,
       oi.quantity * p.price AS line_total
FROM orders o
JOIN customers   c  ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
ORDER BY o.order_id, oi.item_id;`) +
      fig("sql_multi_table_join.png", "Four tables customers, orders, order_items and products connected by key lines in the order they are joined") +
      p("Now add a <code>GROUP BY</code> to turn it into a report: revenue per customer, ignoring cancelled orders:") +
      ex("ja_revenue", `SELECT c.customer_name,
       COUNT(DISTINCT o.order_id)    AS orders,
       SUM(oi.quantity * p.price)    AS revenue
FROM customers c
JOIN orders      o  ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
WHERE o.status <> 'Cancelled'
GROUP BY c.customer_name
ORDER BY revenue DESC;`)
    )}

    ${section("3", "Multiple join conditions and ON vs WHERE",
      p("Join conditions can be combined with <code>AND</code>. In an <strong>INNER</strong> join, a condition in <code>ON</code> or in <code>WHERE</code> gives the same rows. In an <strong>OUTER</strong> join they do <em>not</em>:") +
      ex("ja_on", `SELECT c.customer_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id AND o.status = 'Delivered'
ORDER BY c.customer_id, o.order_id;`, "Condition in ON: every customer stays") +
      ex("ja_where", `SELECT c.customer_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.status = 'Delivered'
ORDER BY c.customer_id, o.order_id;`, "Condition in WHERE: customers without delivered orders disappear") +
      callout("fa-solid fa-circle-info", "<p><code>ON</code> decides which rows <em>match</em>; <code>WHERE</code> filters the <em>final result</em>, which removes the NULL rows an outer join was supposed to keep. For outer joins, filters on the optional table belong in <code>ON</code>.</p>")
    )}

    ${section("4", "ON vs USING",
      p("When the two columns have the <strong>same name</strong>, <code>USING (column)</code> is a shorter form of <code>ON</code>, and the column appears <strong>once</strong> in <code>SELECT *</code>.") +
      ex("ja_using", `SELECT *
FROM orders
JOIN customers USING (customer_id)
WHERE order_id = 1001;`) +
      table(["", "ON", "USING"], [
        ["Column names", "May differ: " + c("e.dept_id = d.id"), "Must be identical"],
        ["Conditions", "Any condition, " + c("AND") + ", " + c(">") + " …", "Equality on the listed columns only"],
        ["In the result with " + c("SELECT *"), "Both columns appear", "One column appears"],
      ]) +
      warn("avoid <code>NATURAL JOIN</code>. It joins on <em>all</em> same-named columns automatically, so adding a column to a table can silently change your query.")
    )}

    ${section("5", "Joins with WHERE conditions",
      ex("ja_filter", `SELECT c.customer_name, p.product_name, oi.quantity
FROM customers c
JOIN orders      o  ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
WHERE p.category = 'Electronics'
  AND o.status   = 'Delivered'
ORDER BY c.customer_name, p.product_name;`)
    )}

    ${section("6", "Handling unmatched records",
      sub("", "Customers who never placed an order (anti-join)") +
      ex("ja_anti", `SELECT c.customer_id, c.customer_name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`) +
      sub("", "Counting with zeros included") +
      ex("ja_count", `SELECT c.customer_name,
       COUNT(o.order_id) AS orders,
       COUNT(*)          AS wrong_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_name
ORDER BY c.customer_name;`) +
      p("Priya has <code>0</code> orders with <code>COUNT(o.order_id)</code>, which skips the NULLs created by the outer join. <code>COUNT(*)</code> counts her unmatched row as 1: a classic mistake. Replace missing values with <code>COALESCE</code> when you show them:") +
      ex("ja_coalesce", `SELECT c.customer_name,
       COALESCE(o.status, 'No orders') AS status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE c.customer_id IN (4, 5)
ORDER BY c.customer_id;`)
    )}

    ${section("7", "Self-join applications and employee examples",
      /*# db: ja2 emp */ "" +
      p("Back to the <code>employees</code> and <code>departments</code> tables.") +
      sub("", "Employees who earn more than their manager") +
      ex("ja_self1", `SELECT e.emp_name   AS employee, e.salary,
       m.emp_name   AS manager,  m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary
ORDER BY e.emp_id;`) +
      sub("", "Pairs of colleagues living in the same city") +
      ex("ja_self2", `SELECT a.emp_name AS employee_1, b.emp_name AS employee_2, a.city
FROM employees a
JOIN employees b ON a.city = b.city AND a.emp_id < b.emp_id
ORDER BY a.city, a.emp_id, b.emp_id;`) +
      p("The extra condition <code>a.emp_id &lt; b.emp_id</code> stops an employee being paired with himself, and stops each pair appearing twice (A–B and B–A).") +
      sub("", "Department report that includes empty departments") +
      ex("ja_dept", `SELECT d.dept_name,
       COUNT(e.emp_id)                AS headcount,
       COALESCE(SUM(e.salary), 0)     AS payroll
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id
GROUP BY d.dept_name
ORDER BY d.dept_name;`)
    )}

    ${section("8", "Real-world employee, department, customer and order examples",
      table(["Business question", "Pattern"], [
        ["Which employees have no department yet?", c("employees LEFT JOIN departments ... WHERE d.dept_id IS NULL")],
        ["Revenue by customer / product / category / month", "join the fact tables, then " + c("GROUP BY")],
        ["Customers who bought but never returned anything", "anti-join with " + c("LEFT JOIN ... IS NULL")],
        ["Who reports to whom, and how many reports does each manager have?", "self join + " + c("GROUP BY")],
        ["Orders with customer name, product and amount in one table", "multi-table " + c("JOIN")],
      ]) +
      tip("build a join <strong>one table at a time</strong>: start with two tables, check the result, add the third, check again. When the row count is suddenly too large, a join condition is missing or the relationship is many-to-many.")
    )}
  `);

/* =========================================================================
   MODULE 7 (continued) — Subqueries
   MODULE 8 — Transactions and triggers
   ========================================================================= */

//# db: sq emp
topic("subqueries", "Subqueries", "Intermediate",
  "Queries inside queries: single-row and multiple-row subqueries, IN / NOT IN, ANY / ALL, EXISTS / NOT EXISTS, correlated subqueries, subqueries in SELECT, FROM, WHERE, UPDATE and DELETE, and subquery vs JOIN.",
  "fa-solid fa-layer-group", "Subqueries", "A query inside another query",
  () => `
    ${section("1", "Introduction to subqueries",
      p("A <strong>subquery</strong> (inner query) is a <code>SELECT</code> placed inside another statement, in brackets. The database runs the inner query and the <strong>outer query</strong> uses its result.") +
      ex("sq_intro", `SELECT emp_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`) +
      p("“Who earns more than the company average?” needs two steps: first the average, then the comparison. The subquery does step one so you do not have to type the number 60875 by hand (and it stays correct when salaries change).") +
      fig("sql_subquery.png", "A nested query diagram: the inner SELECT returning the average salary feeds its value into the outer SELECT's WHERE clause") +
      p("Data: <code>employees</code> and <code>departments</code> (setup script in the SELECT topic) and, at the end, the shop tables.")
    )}

    ${section("2", "Inner and outer queries; simple subqueries",
      table(["", "Inner query (subquery)", "Outer query"], [
        ["Where", "Inside brackets", "Around it"],
        ["Runs", "Usually first (or once per outer row if correlated)", "Uses the inner result"],
        ["Can be", "Used on its own to test it", "Not usable alone without the subquery"],
      ]) +
      tip("always write and test the inner query <strong>alone</strong> first, then wrap it in the outer query.")
    )}

    ${section("3", "Single-row subqueries",
      p("A subquery that returns <strong>one value</strong> (one row, one column) can be used with <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&lt;&gt;</code> and so on.") +
      ex("sq_max", `SELECT emp_name, salary
FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);`) +
      ex("sq_dept", `SELECT emp_name, salary
FROM employees
WHERE dept_id = (SELECT dept_id FROM departments WHERE dept_name = 'IT')
ORDER BY emp_id;`) +
      p("If the subquery returns more than one row where only one is allowed, PostgreSQL stops:") +
      ex("sq_err", `SELECT emp_name
FROM employees
WHERE salary = (SELECT salary FROM employees WHERE dept_id = 10);`) +
      p("The fix is to expect many values, with <code>IN</code> / <code>ANY</code> / <code>ALL</code> (next), or to reduce them to one with an aggregate.")
    )}

    ${section("4", "Multiple-row subqueries: IN, ANY, ALL",
      sub("", "IN") +
      ex("sq_in", `SELECT emp_name, city
FROM employees
WHERE dept_id IN (SELECT dept_id FROM departments WHERE location IN ('Hyderabad', 'Chennai'))
ORDER BY emp_id;`) +
      sub("", "ANY and ALL") +
      table(["Operator", "Meaning", "Example"], [
        [c("> ANY (subquery)"), "Greater than <em>at least one</em> value (so: greater than the minimum)", c("salary > ANY (…)")],
        [c("> ALL (subquery)"), "Greater than <em>every</em> value (so: greater than the maximum)", c("salary > ALL (…)")],
        [c("= ANY (subquery)"), "Same as " + c("IN"), c("dept_id = ANY (…)")],
      ]) +
      ex("sq_all", `-- earns more than EVERY Sales employee
SELECT emp_name, salary
FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE dept_id = 10)
ORDER BY salary;`) +
      ex("sq_any", `-- earns more than AT LEAST ONE HR employee
SELECT emp_name, salary
FROM employees
WHERE salary > ANY (SELECT salary FROM employees WHERE dept_id = 20)
ORDER BY salary;`)
    )}

    ${section("5", "NOT IN, and its NULL trap",
      ex("sq_notin", `SELECT emp_name, dept_id
FROM employees
WHERE dept_id NOT IN (SELECT dept_id FROM departments WHERE dept_name = 'Sales')
ORDER BY emp_id;`) +
      p("Sara (no department) is missing: <code>NULL NOT IN (...)</code> is unknown, so her row is dropped. The bigger danger is a <code>NULL</code> inside the subquery result. Which departments have no employees?") +
      ex("sq_notin_null", `SELECT dept_name
FROM departments
WHERE dept_id NOT IN (SELECT dept_id FROM employees);`) +
      p("Zero rows, although Finance has nobody! Sara's <code>dept_id</code> is <code>NULL</code>, which poisons the whole <code>NOT IN</code>. Two safe fixes: filter the NULLs out of the subquery (below), or, better, use <code>NOT EXISTS</code> (next section).") +
      ex("sq_notin_fix", `SELECT dept_name
FROM departments
WHERE dept_id NOT IN (SELECT dept_id FROM employees WHERE dept_id IS NOT NULL);`)
    )}

    ${section("6", "EXISTS and NOT EXISTS",
      p("<code>EXISTS (subquery)</code> is true if the subquery returns <strong>at least one row</strong>. The columns it selects do not matter (convention: <code>SELECT 1</code>). It stops at the first match, so it is efficient, and it is <strong>NULL-safe</strong>.") +
      ex("sq_exists", `SELECT d.dept_name
FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id)
ORDER BY d.dept_id;`) +
      ex("sq_notexists", `SELECT d.dept_name
FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id);`) +
      tip("prefer <code>NOT EXISTS</code> over <code>NOT IN</code> whenever the inner column might contain NULL.")
    )}

    ${section("7", "Correlated subqueries",
      p("A <strong>correlated</strong> subquery refers to a column of the outer query, so it is evaluated <strong>again for each outer row</strong>. The previous <code>EXISTS</code> examples were correlated (<code>e.dept_id = d.dept_id</code>).") +
      p("“Employees who earn more than the average of <em>their own</em> department”:") +
      ex("sq_corr", `SELECT e.emp_name, e.dept_id, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary)
                  FROM employees x
                  WHERE x.dept_id = e.dept_id)
ORDER BY e.emp_id;`) +
      p("For Ali the inner query becomes “average of department 10”, for Meena “average of department 30”, and so on. Sara has no department, so her comparison is unknown and she is not returned.")
    )}

    ${section("8", "Subqueries in SELECT, FROM and WHERE",
      sub("", "In the SELECT list (scalar subquery)") +
      ex("sq_select", `SELECT d.dept_name,
       (SELECT COUNT(*) FROM employees e WHERE e.dept_id = d.dept_id) AS headcount
FROM departments d
ORDER BY d.dept_id;`) +
      sub("", "In the FROM clause (derived table)") +
      p("The subquery acts as a temporary table and <strong>must have an alias</strong>:") +
      ex("sq_from", `SELECT d.dept_name, s.avg_salary
FROM (SELECT dept_id, ROUND(AVG(salary), 2) AS avg_salary
      FROM employees
      GROUP BY dept_id) AS s
JOIN departments d ON d.dept_id = s.dept_id
ORDER BY s.avg_salary DESC;`) +
      sub("", "In the WHERE clause") +
      p("The most common place, used in all examples above.") +
      sub("", "Classic: the second-highest salary") +
      ex("sq_second", `SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`)
    )}

    ${section("9", "Subqueries with UPDATE and DELETE",
      p("Run inside a transaction so we can look at the effect and undo it:") +
      ex("sq_update", `BEGIN;
UPDATE employees
SET salary = salary * 1.05
WHERE dept_id IN (SELECT dept_id FROM departments WHERE location = 'Bengaluru');

SELECT emp_name, salary FROM employees WHERE dept_id = 30 ORDER BY emp_id;
ROLLBACK;`) +
      ex("sq_delete", `BEGIN;
DELETE FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id)
RETURNING d.dept_name;
ROLLBACK;`) +
      p("The rows to change come from a query, not a hand-typed list: “give a 5% raise to every employee of departments located in Bengaluru”, “delete departments that have no employees”.")
    )}

    ${section("10", "Subquery vs JOIN",
      table(["", "Subquery", "JOIN"], [
        ["Reads like", "Step by step: “find X, then use it”", "One combined table"],
        ["Columns from the inner table in the result", "No (only in the outer query's table)", "Yes"],
        ["Best for", "Filtering (" + c("IN") + ", " + c("EXISTS") + "), single computed values", "Showing columns from several tables"],
        ["Duplicates risk", "None: it only filters", "A one-to-many join repeats outer rows"],
        ["Performance", "PostgreSQL often rewrites one into the other", "Usually equal; test with " + c("EXPLAIN")],
      ]) +
      p("The same question both ways, “employees working in the IT department”:") +
      ex("sq_vs_join1", `SELECT emp_name
FROM employees
WHERE dept_id IN (SELECT dept_id FROM departments WHERE dept_name = 'IT')
ORDER BY emp_id;`, "Subquery") +
      ex("sq_vs_join2", `SELECT e.emp_name
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
WHERE d.dept_name = 'IT'
ORDER BY e.emp_id;`, "Join") +
      p("Same answer. Use the join if you also want <code>d.location</code> in the output; use the subquery if you only need to filter.")
    )}

    ${section("11", "Practical business problems",
      /*# db: sq2 shop */ "" +
      p("On the shop tables:") +
      sub("", "Customers who have at least one delivered order") +
      ex("sq_shop1", `SELECT customer_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'Delivered')
ORDER BY customer_id;`) +
      sub("", "Products never sold in a delivered order") +
      ex("sq_shop2", `SELECT p.product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN orders o ON o.order_id = oi.order_id
    WHERE oi.product_id = p.product_id AND o.status = 'Delivered')
ORDER BY p.product_id;`) +
      sub("", "Products priced above their category's average") +
      ex("sq_shop3", `SELECT p.product_name, p.category, p.price
FROM products p
WHERE p.price > (SELECT AVG(price) FROM products WHERE category = p.category)
ORDER BY p.product_id;`)
    )}
  `);

//# db: tx
topic("transactions", "Database Transactions", "Intermediate",
  "BEGIN, COMMIT, ROLLBACK, SAVEPOINT and ROLLBACK TO SAVEPOINT, the ACID properties, how errors affect a transaction and a complete bank-transfer example.",
  "fa-solid fa-right-left", "Database Transactions", "All-or-nothing groups of changes",
  () => `
    ${section("1", "Introduction to transactions",
      p("A <strong>transaction</strong> is a group of SQL statements that the database treats as <strong>one unit of work</strong>: either <em>all</em> of them take effect, or <em>none</em> do.") +
      p("By default PostgreSQL runs in <strong>autocommit</strong> mode: every single statement is its own transaction and is saved at once. To group several statements you start a transaction yourself with <code>BEGIN</code>.") +
      ex("tx_setup", `CREATE TABLE accounts (
    account_id  INTEGER PRIMARY KEY,
    holder      VARCHAR(30) NOT NULL,
    balance     NUMERIC(12,2) NOT NULL CHECK (balance >= 0)
);

INSERT INTO accounts VALUES
    (1, 'Ali Khan',    50000),
    (2, 'Ayesha Rao',  30000),
    (3, 'Ravi Kumar',  10000);`)
    )}

    ${section("2", "Why do we need transactions?",
      p("Moving ₹10,000 from Ali to Ayesha takes <strong>two</strong> updates: subtract from one account, add to the other. If the power fails (or an error occurs) after the first update, ₹10,000 has vanished. A transaction guarantees that this half-finished state is never saved.") +
      fig("sql_transaction_transfer.png", "Bank transfer as one transaction: debit Ali and credit Ayesha either both succeed (COMMIT) or both are undone (ROLLBACK)")
    )}

    ${section("3", "COMMIT",
      table(["Command", "Meaning"], [
        [c("BEGIN") + " (or " + c("START TRANSACTION") + ")", "Start a transaction"],
        [c("COMMIT"), "Make all changes permanent and visible to others"],
        [c("ROLLBACK"), "Undo all changes since " + c("BEGIN")],
      ]) +
      ex("tx_commit", `BEGIN;
UPDATE accounts SET balance = balance - 10000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 10000 WHERE account_id = 2;
COMMIT;

SELECT * FROM accounts ORDER BY account_id;`) +
      p("Until <code>COMMIT</code>, other sessions see the old balances. After it, everyone sees the new ones.")
    )}

    ${section("4", "ROLLBACK",
      ex("tx_rollback", `BEGIN;
UPDATE accounts SET balance = balance - 5000 WHERE account_id = 1;
SELECT account_id, balance FROM accounts WHERE account_id = 1;   -- inside the transaction
ROLLBACK;
SELECT account_id, balance FROM accounts WHERE account_id = 1;   -- after rollback`) +
      p("Inside the transaction you see your own change (35,000); after <code>ROLLBACK</code> the balance is back to 40,000, as if nothing had happened. Closing the connection without <code>COMMIT</code> also rolls back.") +
      callout("fa-solid fa-circle-info", "<p>In PostgreSQL even <strong>DDL</strong> is transactional: <code>CREATE TABLE</code>, <code>ALTER TABLE</code> and <code>DROP TABLE</code> can be rolled back too (unlike in Oracle or MySQL).</p>") +
      ex("tx_ddl", `BEGIN;
CREATE TABLE temp_experiment (id INTEGER);
ROLLBACK;
SELECT * FROM temp_experiment;`)
    )}

    ${section("5", "SAVEPOINT and ROLLBACK TO SAVEPOINT",
      p("A <strong>savepoint</strong> is a bookmark inside a transaction. You can undo back to it without throwing away the earlier work.") +
      ex("tx_savepoint", `BEGIN;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 3;   -- step 1: keep this

SAVEPOINT after_bonus;

UPDATE accounts SET balance = 0 WHERE account_id = 3;                -- step 2: a mistake!
SELECT balance FROM accounts WHERE account_id = 3;

ROLLBACK TO SAVEPOINT after_bonus;                                   -- undo only step 2
SELECT balance FROM accounts WHERE account_id = 3;

COMMIT;`) +
      bullets([
        "<code>ROLLBACK TO SAVEPOINT name</code> undoes everything after the savepoint; the transaction stays open.",
        "<code>RELEASE SAVEPOINT name</code> forgets the bookmark (the changes stay).",
        "You can create several savepoints with different names.",
      ])
    )}

    ${section("6", "Errors inside a transaction",
      p("If a statement fails inside a transaction, PostgreSQL marks the whole transaction as <strong>aborted</strong>. Every further command is refused until you end it:") +
      ex("tx_error", `BEGIN;
UPDATE accounts SET balance = balance - 99999 WHERE account_id = 3;   -- breaks CHECK (balance >= 0)
SELECT * FROM accounts;
ROLLBACK;`) +
      p("The second statement was perfectly fine but is refused. After <code>ROLLBACK</code> you can start again. (With a savepoint you could roll back <em>only</em> the failed statement.)")
    )}

    ${section("7", "ACID properties",
      table(["Letter", "Property", "Meaning", "Bank example"], [
        ["<strong>A</strong>", "Atomicity", "All steps happen or none do", "Debit and credit both happen, or neither"],
        ["<strong>C</strong>", "Consistency", "The database moves from one valid state to another; constraints always hold", "Total money unchanged; no negative balance"],
        ["<strong>I</strong>", "Isolation", "Concurrent transactions do not see each other's unfinished work", "Another user never sees a half-done transfer"],
        ["<strong>D</strong>", "Durability", "Once committed, data survives crashes and power loss", "A committed transfer is still there after a restart"],
      ]) +
      fig("sql_acid.png", "Four panels illustrating Atomicity, Consistency, Isolation and Durability with simple icons") +
      sub("", "Isolation levels (overview)") +
      p("PostgreSQL's default isolation level is <strong>READ COMMITTED</strong>: a statement sees only data that was committed before it started. Stricter levels (<code>REPEATABLE READ</code>, <code>SERIALIZABLE</code>) give more protection against concurrent changes at the price of possible retry errors. They are chosen with <code>BEGIN ISOLATION LEVEL REPEATABLE READ;</code> and matter mainly in busy systems.")
    )}

    ${section("8", "Practical example: a bank transfer",
      p("A safe transfer checks and moves money inside one transaction. First the successful ₹2,000 from Ayesha (2) to Ravi (3); the total in the bank must not change:") +
      ex("tx_transfer", `BEGIN;
UPDATE accounts SET balance = balance - 2000 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 2000 WHERE account_id = 3;
COMMIT;

SELECT account_id, holder, balance FROM accounts ORDER BY account_id;
SELECT SUM(balance) AS total_money_in_bank FROM accounts;`) +
      p("Now a transfer of ₹50,000 from Ravi, who has too little. The <code>CHECK</code> constraint blocks the debit, so the credit must not be applied either:") +
      ex("tx_transfer_fail", `BEGIN;
UPDATE accounts SET balance = balance - 50000 WHERE account_id = 3;   -- fails
UPDATE accounts SET balance = balance + 50000 WHERE account_id = 1;   -- refused: transaction aborted
COMMIT;
SELECT account_id, balance FROM accounts ORDER BY account_id;`) +
      p("<code>COMMIT</code> on an aborted transaction behaves as <code>ROLLBACK</code>, so no money moved. The balances are exactly as before. This is atomicity in action.") +
      real("applications send <code>BEGIN</code> … <code>COMMIT</code> for every business action: placing an order, booking a seat, paying a bill. Keep transactions <strong>short</strong>, as open transactions hold locks that make other users wait.")
    )}
  `);

//# db: tg emp
topic("triggers", "Introduction to Triggers", "Advanced",
  "What triggers are and why they are used, trigger events, BEFORE and AFTER, row-level and statement-level triggers, PL/pgSQL trigger functions, auditing salary changes, enabling, disabling and dropping triggers.",
  "fa-solid fa-bolt", "Introduction to Triggers", "Code that runs automatically when data changes",
  () => `
    ${section("1", "What is a trigger? Why are triggers required?",
      p("A <strong>trigger</strong> is a rule that says: “whenever this happens to this table, automatically run this function.” You never call it; the database does, on every matching <code>INSERT</code>, <code>UPDATE</code> or <code>DELETE</code>.") +
      bullets([
        "<strong>Auditing</strong> – record who changed a salary, from what to what, and when.",
        "<strong>Validation</strong> – block changes that break a business rule too complex for a <code>CHECK</code>.",
        "<strong>Automatic values</strong> – fill “last updated” columns, normalise text.",
        "<strong>Keeping tables in step</strong> – update a summary table when details change.",
      ]) +
      callout("fa-solid fa-triangle-exclamation", "<p>Triggers are powerful but <strong>invisible</strong>: a developer reading an <code>UPDATE</code> does not see what else it does. Use them for data rules and auditing, and document them. Do not hide long business workflows in them.</p>") +
      p("Data: <code>employees</code> (setup script in the SELECT topic).")
    )}

    ${section("2", "Trigger events",
      table(["Event", "Fires when", "Row values available"], [
        [c("INSERT"), "A row is added", c("NEW") + " (the new row)"],
        [c("UPDATE"), "A row is changed", c("OLD") + " (before) and " + c("NEW") + " (after)"],
        [c("DELETE"), "A row is removed", c("OLD") + " (the deleted row)"],
        [c("TRUNCATE"), "The table is truncated (statement-level only)", "none"],
      ])
    )}

    ${section("3", "BEFORE and AFTER triggers",
      table(["", "BEFORE", "AFTER"], [
        ["Runs", "Before the row is written", "After the row has been written"],
        ["Can change the row?", "Yes: change " + c("NEW") + " and return it", "No (too late)"],
        ["Can cancel the operation?", "Yes: raise an exception, or return " + c("NULL"), "Only by raising an exception"],
        ["Typical use", "Validate and clean data", "Audit logs, notifications, keeping other tables updated"],
      ])
    )}

    ${section("4", "Row-level and statement-level triggers",
      table(["", "FOR EACH ROW", "FOR EACH STATEMENT"], [
        ["Runs", "Once <em>per affected row</em>", "Once <em>per SQL statement</em>"],
        ["Access to " + c("OLD") + " / " + c("NEW"), "Yes", "No"],
        ["Example", "Log each salary change", "Log that someone ran a bulk delete"],
      ]) +
      p("An <code>UPDATE</code> that changes 100 rows fires a row-level trigger 100 times but a statement-level trigger once.")
    )}

    ${section("5", "Trigger functions and PL/pgSQL",
      p("A trigger runs a <strong>trigger function</strong>: a function written in <strong>PL/pgSQL</strong> (PostgreSQL's procedural language) that takes no arguments and <code>RETURNS trigger</code>. Creating a trigger is always two steps:") +
      numlist("", [
        ["Create the function", c("CREATE FUNCTION ... RETURNS trigger")],
        ["Attach it", c("CREATE TRIGGER ... ON table ... EXECUTE FUNCTION function()")],
      ]) +
      exn("tg_skeleton", `CREATE OR REPLACE FUNCTION function_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- statements; NEW and OLD are available
    RETURN NEW;      -- BEFORE row trigger: the row to be stored (NULL cancels it)
END;
$$;

CREATE TRIGGER trigger_name
{ BEFORE | AFTER } { INSERT | UPDATE [OF column] | DELETE }
ON table_name
FOR EACH { ROW | STATEMENT }
EXECUTE FUNCTION function_name();`, "Skeleton") +
      note("Dollar quoting:", "<code>$$ ... $$</code> wraps the function body so that the semicolons inside it are not mistaken for the end of the <code>CREATE FUNCTION</code> statement. Special variables inside: <code>NEW</code>, <code>OLD</code>, <code>TG_OP</code> (the operation name).")
    )}

    ${section("6", "Practical example: automatically recording employee salary changes",
      p("First, the audit table:") +
      ex("tg_table", `CREATE TABLE salary_audit (
    audit_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emp_id      INTEGER,
    old_salary  NUMERIC(10,2),
    new_salary  NUMERIC(10,2),
    changed_by  TEXT DEFAULT current_user,
    changed_at  TIMESTAMPTZ DEFAULT now()
);`) +
      p("The trigger function. <code>IS DISTINCT FROM</code> is a NULL-safe “not equal”:") +
      ex("tg_func", `CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.salary IS DISTINCT FROM OLD.salary THEN
        INSERT INTO salary_audit (emp_id, old_salary, new_salary)
        VALUES (OLD.emp_id, OLD.salary, NEW.salary);
    END IF;
    RETURN NEW;
END;
$$;`) +
      p("Attach it to run <strong>after</strong> a salary update, once per row:") +
      ex("tg_create", `CREATE TRIGGER trg_salary_audit
AFTER UPDATE OF salary ON employees
FOR EACH ROW
EXECUTE FUNCTION log_salary_change();`) +
      p("Now give two employees a raise. Nothing in the statement mentions the audit table:") +
      ex("tg_test", `UPDATE employees SET salary = salary + 5000 WHERE emp_id IN (101, 105);

SELECT audit_id, emp_id, old_salary, new_salary, changed_by
FROM salary_audit
ORDER BY audit_id;`) +
      p("Two rows were written automatically. <code>changed_at</code> (not shown) holds the exact time.")
    )}

    ${section("7", "A BEFORE trigger: protecting a business rule",
      p("A <code>BEFORE</code> trigger can <strong>reject</strong> a change. Rule: “a salary may never be reduced.”") +
      ex("tg_before", `CREATE OR REPLACE FUNCTION prevent_salary_cut()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.salary < OLD.salary THEN
        RAISE EXCEPTION 'Salary cut not allowed for employee %: % -> %', OLD.emp_id, OLD.salary, NEW.salary;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_salary_cut
BEFORE UPDATE OF salary ON employees
FOR EACH ROW
EXECUTE FUNCTION prevent_salary_cut();`) +
      ex("tg_before_test", `UPDATE employees SET salary = 40000 WHERE emp_id = 101;`) +
      p("A <code>BEFORE INSERT</code> trigger can also <strong>clean</strong> data by changing <code>NEW</code>:") +
      ex("tg_clean", `CREATE OR REPLACE FUNCTION tidy_employee_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.emp_name := INITCAP(TRIM(NEW.emp_name));
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tidy_name
BEFORE INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION tidy_employee_name();

INSERT INTO employees (emp_id, emp_name, dept_id, salary, hire_date)
VALUES (109, '  mohan das ', 30, 50000, '2026-10-01')
RETURNING emp_id, emp_name;`)
    )}

    ${section("8", "Viewing, disabling and dropping triggers",
      sub("", "Viewing triggers") +
      ex("tg_list", `SELECT trigger_name, event_manipulation AS event, action_timing AS timing, action_orientation AS level
FROM information_schema.triggers
WHERE event_object_table = 'employees'
ORDER BY trigger_name;`) +
      sh("psql", `\\d employees      -- the "Triggers:" section lists them`) +
      sub("", "Disabling and enabling") +
      p("Useful during bulk loads or data repairs:") +
      ex("tg_disable", `ALTER TABLE employees DISABLE TRIGGER trg_prevent_salary_cut;
UPDATE employees SET salary = 52000 WHERE emp_id = 101;     -- allowed now
ALTER TABLE employees ENABLE TRIGGER trg_prevent_salary_cut;`) +
      exn("tg_disable_all", `ALTER TABLE employees DISABLE TRIGGER ALL;   -- every trigger on the table
ALTER TABLE employees ENABLE TRIGGER ALL;`, "All triggers") +
      sub("", "Dropping a trigger and its function") +
      ex("tg_drop", `DROP TRIGGER trg_tidy_name ON employees;
DROP TRIGGER IF EXISTS trg_salary_audit ON employees;
DROP FUNCTION tidy_employee_name();`) +
      p("Dropping the trigger does not drop the function (and vice versa). A function used by a trigger cannot be dropped until the trigger is.")
    )}

    ${section("9", "Introduction to auditing using triggers",
      p("<strong>Auditing</strong> means keeping a trustworthy history of who changed what, and when. For regulated data (finance, health) it is often a legal requirement. The pattern from this topic extends to every table:") +
      numlist("", [
        ["An audit table", "columns for table name, row key, operation, old and new values, user, time."],
        ["A trigger function", "inserts into the audit table using " + c("TG_OP") + ", " + c("OLD") + " and " + c("NEW") + "."],
        ["An AFTER trigger", "on INSERT, UPDATE and DELETE, so only changes that really happened are logged."],
      ]) +
      tip("because the trigger runs inside the same transaction as the change, the audit row and the data change are <strong>committed together or rolled back together</strong>: the log can never disagree with the data.")
    )}
  `);

/* =========================================================================
   MODULE 9 — SQL performance and database security
   MODULE 10 — SQL with artificial intelligence
   ========================================================================= */

//# db: ix
topic("indexing", "Database Indexing and Performance", "Advanced",
  "What indexes are and why they speed up queries, CREATE / DROP INDEX, unique and composite indexes, B-tree and hash indexes, advantages and disadvantages, EXPLAIN, EXPLAIN ANALYZE and basic query optimisation.",
  "fa-solid fa-gauge-high", "Indexing and Performance", "Making queries fast on large tables",
  () => `
    ${section("1", "What is an index?",
      p("An <strong>index</strong> is a separate, sorted structure that lets PostgreSQL find rows without reading the whole table: exactly like the index at the back of a textbook. Instead of reading all 600 pages to find “GROUP BY”, you look it up in the index and jump to page 214.") +
      fig("sql_index_concept.png", "Left: a full table scan reading every row. Right: an index lookup jumping straight to the matching rows using a sorted structure")
    )}

    ${section("2", "Why are indexes required?",
      p("On 8 rows nothing matters. On <strong>100,000 or 100 million rows</strong>, searching row by row (a <em>sequential scan</em>) is slow. A table with an index on the searched column lets the same query touch only a handful of rows.") +
      p("We will build a table of 100,000 orders to see the effect:") +
      ex("ix_setup", `CREATE TABLE big_orders AS
SELECT g                                      AS order_id,
       (g % 5000) + 1                         AS customer_id,
       DATE '2025-01-01' + (g % 365)          AS order_date,
       ((g % 997) * 10 + 100)::numeric(10,2)  AS amount
FROM generate_series(1, 100000) AS g;

ALTER TABLE big_orders ADD PRIMARY KEY (order_id);
ANALYZE big_orders;

SELECT COUNT(*) AS rows_in_table FROM big_orders;`) +
      note("Reading plans:", "the cost numbers and row estimates below come from PostgreSQL's planner. <strong>Your numbers will differ slightly</strong> (hardware, version, settings); what matters is the <em>kind</em> of scan.")
    )}

    ${section("3", "Finding out what PostgreSQL does: EXPLAIN",
      p("<code>EXPLAIN</code> shows the <strong>execution plan</strong>: how PostgreSQL intends to run the query. It does not execute it.") +
      ex("ix_explain1", `EXPLAIN
SELECT * FROM big_orders WHERE customer_id = 1234;`) +
      table(["Part of the plan", "Meaning"], [
        [c("Seq Scan"), "Sequential scan: reads <em>every</em> row of the table"],
        [c("Filter"), "Condition applied to each row as it is read"],
        [c("cost=0.00..1887.00"), "Estimated cost: start-up cost .. total cost (arbitrary units; lower is better)"],
        [c("rows=20"), "Estimated number of rows returned"],
      ])
    )}

    ${section("4", "Creating an index",
      exn("ix_syntax", `CREATE [UNIQUE] INDEX [IF NOT EXISTS] index_name
ON table_name [USING method] (column1 [, column2 ...]);`, "Syntax") +
      ex("ix_create", `CREATE INDEX idx_orders_customer ON big_orders (customer_id);
ANALYZE big_orders;`) +
      p("Ask for the plan of the same query again:") +
      ex("ix_explain2", `EXPLAIN
SELECT * FROM big_orders WHERE customer_id = 1234;`) +
      p("The plan changed from <code>Seq Scan</code> to an <strong>index scan</strong> (a <code>Bitmap Index Scan</code> followed by a <code>Bitmap Heap Scan</code>, or a plain <code>Index Scan</code>), and the estimated cost fell dramatically. Typical <code>EXPLAIN ANALYZE</code> results show the effect in real time:") +
      exo("ix_analyze", `EXPLAIN ANALYZE
SELECT * FROM big_orders WHERE customer_id = 1234;`, `                                  QUERY PLAN
--------------------------------------------------------------------------------
 Bitmap Heap Scan on big_orders  (cost=4.73..71.98 rows=20 width=17) (actual time=0.041..0.087 rows=20 loops=1)
   Recheck Cond: (customer_id = 1234)
   ->  Bitmap Index Scan on idx_orders_customer  (cost=0.00..4.72 rows=20 width=0) (actual time=0.029..0.029 rows=20 loops=1)
         Index Cond: (customer_id = 1234)
 Planning Time: 0.210 ms
 Execution Time: 0.121 ms`, "EXPLAIN ANALYZE (illustrative output)") +
      p("<code>EXPLAIN ANALYZE</code> <strong>actually runs</strong> the query and adds the real times and row counts. Compare “estimated rows” with “actual rows”: a big difference means outdated statistics (run <code>ANALYZE</code>). Without the index, the same query takes tens of milliseconds on this table; on 100 million rows, seconds or minutes.") +
      warn("<code>EXPLAIN ANALYZE</code> on an <code>UPDATE</code> or <code>DELETE</code> really changes data. Wrap it in <code>BEGIN; ... ROLLBACK;</code>.")
    )}

    ${section("5", "Indexes created for you: primary keys",
      p("A <code>PRIMARY KEY</code> or <code>UNIQUE</code> constraint automatically creates an index. That is why searching by <code>order_id</code> is always fast:") +
      ex("ix_pk", `EXPLAIN
SELECT * FROM big_orders WHERE order_id = 500;`)
    )}

    ${section("6", "Unique index",
      p("A <strong>unique index</strong> speeds up searches <em>and</em> forbids duplicate values (a <code>UNIQUE</code> constraint is implemented with one).") +
      ex("ix_unique", `CREATE TABLE members (member_id INTEGER, email VARCHAR(60));
CREATE UNIQUE INDEX uq_members_email ON members (email);

INSERT INTO members VALUES (1, 'ali@example.com');
INSERT INTO members VALUES (2, 'ali@example.com');`)
    )}

    ${section("7", "Composite (multi-column) index",
      p("An index on several columns helps queries that filter on those columns <strong>together</strong>. Column order matters: it works for a query on the <em>leading</em> column(s), like a phone book sorted by surname, then first name.") +
      ex("ix_composite", `CREATE INDEX idx_cust_date ON big_orders (customer_id, order_date);
ANALYZE big_orders;

EXPLAIN
SELECT * FROM big_orders
WHERE customer_id = 1234 AND order_date >= '2025-06-01';`) +
      table(["Query filters on", "Can use the index (customer_id, order_date)?"], [
        [c("customer_id") + " and " + c("order_date"), "Yes: best case"],
        [c("customer_id") + " only", "Yes: leading column"],
        [c("order_date") + " only", "Poorly or not at all: the leading column is missing"],
      ]) +
      tip("put the column you filter on with <code>=</code> most often first, and the range column (dates) last.")
    )}

    ${section("8", "Index types: B-tree and Hash",
      p("The default, and the right choice nearly always, is the <strong>B-tree</strong>: a balanced tree that keeps keys sorted. It supports <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>, <code>ORDER BY</code> and prefix <code>LIKE 'abc%'</code>.") +
      fig("sql_btree_index.png", "A B-tree index: a root node pointing to branch nodes pointing to leaf nodes that hold sorted keys and row locations") +
      table(["", "B-tree (default)", "Hash"], [
        ["Equality (" + c("=") + ")", "Yes", "Yes (the only thing it does)"],
        ["Ranges, sorting", "Yes", "No"],
        ["Typical use", "Almost everything", "Rare: equality on very large keys"],
        ["Syntax", c("CREATE INDEX ... ON t (col)"), c("CREATE INDEX ... ON t USING HASH (col)")],
      ]) +
      p("PostgreSQL has other types for special jobs: <code>GIN</code> (JSONB, arrays, full-text search), <code>GiST</code> (geometry, ranges), <code>BRIN</code> (huge tables ordered by time).")
    )}

    ${section("9", "Advantages and disadvantages of indexes",
      split("Advantages", [
        "Much faster <code>WHERE</code> lookups and joins on the indexed columns.",
        "Faster <code>ORDER BY</code> and <code>MIN</code> / <code>MAX</code> on the column.",
        "Unique indexes enforce rules.",
      ], "Disadvantages", [
        "Take <strong>disk space</strong>.",
        "<strong>Slow down writes</strong>: every <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> must also update each index.",
        "Useless on small tables, or on columns with few distinct values (a <code>gender</code> column).",
        "More indexes = more maintenance.",
      ]) +
      ex("ix_size", `SELECT pg_size_pretty(pg_relation_size('big_orders'))          AS table_size,
       pg_size_pretty(pg_relation_size('idx_orders_customer')) AS one_index_size;`) +
      callout("fa-solid fa-lightbulb", "<p><strong>What to index:</strong> columns used often in <code>WHERE</code>, in <code>JOIN ... ON</code> (especially <strong>foreign keys</strong>, which PostgreSQL does not index automatically) and in <code>ORDER BY</code> on big tables. Do not index everything.</p>")
    )}

    ${section("10", "Listing and dropping indexes",
      ex("ix_list", `SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'big_orders'
ORDER BY indexname;`) +
      sh("psql", `\\di            -- list indexes
\\d big_orders   -- the table's indexes appear under "Indexes:"`) +
      ex("ix_drop", `DROP INDEX idx_cust_date;
DROP INDEX IF EXISTS idx_orders_customer;`) +
      p("Dropping an index never loses data; it only makes some queries slower. A <code>PRIMARY KEY</code> index is dropped through its constraint (<code>ALTER TABLE ... DROP CONSTRAINT</code>), not with <code>DROP INDEX</code>.")
    )}

    ${section("11", "Basic query optimisation techniques",
      numlist("", [
        ["Measure first", "use " + c("EXPLAIN (ANALYZE)") + " instead of guessing."],
        ["Select only what you need", "avoid " + c("SELECT *") + "; fewer columns means less data moved."],
        ["Filter early and precisely", "good " + c("WHERE") + " conditions on indexed columns; " + c("LIMIT") + " when you need only a few rows."],
        ["Do not wrap indexed columns in functions", c("WHERE LOWER(email) = 'x'") + " cannot use a plain index on " + c("email") + "; create an expression index " + c("ON t (LOWER(email))") + " or compare directly."],
        ["Avoid a leading wildcard", c("LIKE '%kumar'") + " cannot use a B-tree index; " + c("LIKE 'kumar%'") + " can."],
        ["Index join columns", "especially foreign keys."],
        ["Keep statistics fresh", c("ANALYZE") + " (autovacuum does it automatically in normal setups)."],
        ["Prefer EXISTS over IN for big subqueries, UNION ALL over UNION", "when duplicates do not matter."],
      ]) +
      real("a report that took 40 seconds is usually one missing index or one <code>SELECT *</code> away from taking 0.2 seconds. <code>EXPLAIN</code> tells you which.")
    )}
  `);

//# db: sec emp
topic("security", "Database Security and User Management", "Advanced",
  "Authentication and authorisation, roles and users, CREATE / ALTER / DROP ROLE, GRANT and REVOKE on databases, schemas, tables and columns, least privilege, and basic backup and restore practice.",
  "fa-solid fa-user-lock", "Security and User Management", "Who can connect, and what may they do?",
  () => `
    ${section("1", "Introduction to database security",
      p("A database holds salaries, customer details and financial records. Security rests on three questions:") +
      table(["Question", "Mechanism", "In PostgreSQL"], [
        ["Who are you?", "<strong>Authentication</strong>", "Login role + password (or certificate, SSO), controlled in " + c("pg_hba.conf")],
        ["What may you do?", "<strong>Authorisation</strong>", c("GRANT") + " / " + c("REVOKE") + " privileges"],
        ["What did you do?", "<strong>Auditing</strong>", "Logs, audit triggers, " + c("pgaudit") + " extension"],
      ]) +
      p("Data: <code>employees</code> (setup script in the SELECT topic).")
    )}

    ${section("2", "Roles: users and groups",
      p("PostgreSQL has just one concept: the <strong>role</strong>. A role with the <code>LOGIN</code> attribute is what other systems call a <em>user</em>; a role without it, used to bundle privileges, is a <em>group</em>. Roles can be members of other roles.") +
      fig("sql_roles_privileges.png", "Users analyst and intern are members of group roles; group roles hold privileges on tables; arrows show inheritance") +
      sh("psql", `\\du         -- list roles`)
    )}

    ${section("3", "CREATE ROLE",
      exn("sec_syntax", `CREATE ROLE role_name [WITH option ...];`, "Syntax") +
      table(["Option", "Meaning"], [
        [c("LOGIN") + " / " + c("NOLOGIN"), "May / may not connect (a real user vs a group)"],
        [c("PASSWORD 'xxx'"), "Password for login"],
        [c("SUPERUSER"), "Bypasses every permission check. <strong>Give to almost nobody.</strong>"],
        [c("CREATEDB"), "May create databases"],
        [c("CREATEROLE"), "May create other roles"],
        [c("CONNECTION LIMIT n"), "Maximum simultaneous connections"],
        [c("VALID UNTIL 'date'"), "Password expiry date"],
      ]) +
      ex("sec_create", `CREATE ROLE analyst LOGIN PASSWORD 'Str0ng#Pass' CONNECTION LIMIT 5;
CREATE ROLE intern  LOGIN PASSWORD 'Intern#2026';
CREATE ROLE readonly_group NOLOGIN;`) +
      ex("sec_roles", `SELECT rolname, rolcanlogin AS can_login, rolsuper AS superuser
FROM pg_roles
WHERE rolname IN ('analyst', 'intern', 'readonly_group')
ORDER BY rolname;`) +
      warn("use strong, unique passwords and never put real ones in scripts or code repositories. <code>CREATE USER name</code> is shorthand for <code>CREATE ROLE name LOGIN</code>.")
    )}

    ${section("4", "ALTER ROLE",
      ex("sec_alter", `ALTER ROLE analyst PASSWORD 'N3w#Passw0rd';
ALTER ROLE analyst CREATEDB;
ALTER ROLE intern  VALID UNTIL '2026-12-31';
ALTER ROLE intern  RENAME TO trainee;`)
    )}

    ${section("5", "GRANT: giving privileges",
      exn("sec_grant_syntax", `GRANT privilege [, ...] ON object TO role [WITH GRANT OPTION];`, "Syntax") +
      p("By default a new role can do <strong>nothing</strong> except connect. Privileges are added one by one. Give read access to a group role, then make the user a member:") +
      ex("sec_grant", `GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_group;
GRANT readonly_group TO analyst;
GRANT SELECT, INSERT, UPDATE ON employees TO analyst;
GRANT SELECT (emp_name, city) ON employees TO trainee;`) +
      p("The last line is a <strong>column-level</strong> grant: the trainee may see names and cities, not salaries. Test it by acting as that role:") +
      ex("sec_test", `SET ROLE trainee;
SELECT emp_name, city FROM employees ORDER BY emp_name LIMIT 3;
SELECT salary FROM employees;
DELETE FROM employees;
RESET ROLE;`) +
      p("Reading the allowed columns works (the <code>ORDER BY</code> uses an allowed column too: sorting by <code>emp_id</code> would need <code>SELECT</code> permission on it). Asking for <code>salary</code> or deleting is refused. <code>SET ROLE</code> / <code>RESET ROLE</code> let an administrator test what another role can do.") +
      bullets([
        "<code>WITH GRANT OPTION</code> lets the receiver pass the privilege on to others.",
        "<code>GRANT ALL PRIVILEGES</code> gives every privilege of that object type; avoid it for application users.",
        "<code>ALTER DEFAULT PRIVILEGES</code> makes <em>future</em> tables inherit the grants.",
      ])
    )}

    ${section("6", "REVOKE: taking privileges back",
      ex("sec_revoke", `REVOKE INSERT, UPDATE ON employees FROM analyst;
REVOKE readonly_group FROM analyst;`) +
      sub("", "Seeing what is granted") +
      ex("sec_show", `SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'employees' AND grantee IN ('analyst', 'readonly_group')
ORDER BY grantee, privilege_type;`)
    )}

    ${section("7", "Database-, schema- and table-level permissions",
      table(["Level", "Privileges", "Example"], [
        ["<strong>Database</strong>", c("CONNECT") + ", " + c("CREATE") + " (new schemas), " + c("TEMPORARY"), c("GRANT CONNECT ON DATABASE company_db TO analyst;")],
        ["<strong>Schema</strong>", c("USAGE") + " (see objects inside), " + c("CREATE") + " (create objects)", c("GRANT USAGE ON SCHEMA sales TO analyst;")],
        ["<strong>Table</strong>", c("SELECT") + ", " + c("INSERT") + ", " + c("UPDATE") + ", " + c("DELETE") + ", " + c("TRUNCATE") + ", " + c("REFERENCES") + ", " + c("TRIGGER"), c("GRANT SELECT ON sales.orders TO analyst;")],
        ["<strong>Column</strong>", c("SELECT") + ", " + c("INSERT") + ", " + c("UPDATE") + " on listed columns", c("GRANT SELECT (emp_name) ON employees TO trainee;")],
      ]) +
      callout("fa-solid fa-circle-info", "<p>To read <code>sales.orders</code> a role needs <strong>both</strong> <code>USAGE</code> on the schema <strong>and</strong> <code>SELECT</code> on the table. Missing either gives “permission denied”.</p>") +
      exn("sec_levels", `GRANT CONNECT ON DATABASE company_db TO analyst;
GRANT USAGE   ON SCHEMA   sales      TO analyst;
GRANT SELECT  ON ALL TABLES IN SCHEMA sales TO analyst;`, "A complete read-only setup")
    )}

    ${section("8", "DROP ROLE",
      p("A role that still owns objects or holds privileges cannot be dropped:") +
      ex("sec_drop1", `DROP ROLE trainee;`) +
      p("First remove its privileges (and hand over or drop what it owns), then drop it:") +
      ex("sec_drop2", `DROP OWNED BY trainee;
DROP ROLE trainee;

DROP OWNED BY analyst, readonly_group;
DROP ROLE IF EXISTS analyst, readonly_group;`) +
      tip("when someone leaves, <code>REASSIGN OWNED BY old_role TO new_role;</code> transfers their tables first; then <code>DROP OWNED BY</code> and <code>DROP ROLE</code>.")
    )}

    ${section("9", "The principle of least privilege",
      p("Give every role <strong>exactly the access it needs and nothing more</strong>. If an account is compromised, or a query is mistyped, the damage is limited.") +
      table(["Role type", "Should have", "Should not have"], [
        ["Report / BI user", c("SELECT") + " on reporting tables", "Any write access"],
        ["Application user", "DML on its own tables, no DDL", "Superuser, ability to drop tables"],
        ["Intern / trainee", "Read access to practice schemas (or columns)", "Production data, salaries, personal data"],
        ["DBA / admin", "Everything, used only when needed", "Daily use for ordinary work"],
      ]) +
      bullets([
        "Use <strong>group roles</strong> for privileges and add people to them, instead of granting to individuals.",
        "Never connect an application as <code>postgres</code> (the superuser).",
        "Review who has access regularly; remove accounts of people who left.",
        "Protect against <strong>SQL injection</strong>: applications must send values as query parameters, never by joining user input into SQL text.",
        "For finer control PostgreSQL offers <strong>row-level security</strong> (policies decide which rows a role can see).",
      ])
    )}

    ${section("10", "Basic database backup and restoration practices",
      p("Security also means not losing data. A backup that has never been restored is not a backup.") +
      table(["Goal", "Command (run in a terminal)"], [
        ["One database, plain SQL", c("pg_dump -U postgres -d company_db -f company_db.sql")],
        ["One database, compressed (flexible restore)", c("pg_dump -U postgres -Fc -d company_db -f company_db.dump")],
        ["All databases and roles", c("pg_dumpall -U postgres -f everything.sql")],
        ["Restore plain SQL", c("psql -U postgres -d new_db -f company_db.sql")],
        ["Restore compressed", c("pg_restore -U postgres -d new_db --clean company_db.dump")],
      ]) +
      numlist("", [
        ["Automate", "schedule backups (cron, Task Scheduler, or your cloud provider's snapshots)."],
        ["Keep copies elsewhere", "another machine or cloud storage, not only on the same disk."],
        ["Test restores", "restore into an empty database regularly and check the row counts."],
        ["Protect the files", "dumps contain all your data: encrypt them and limit access."],
        ["Know the limits", "a dump is a point-in-time copy. Continuous backup with WAL archiving (point-in-time recovery) is the next level for production."],
      ])
    )}
  `);

//# db: ai shop
topic("sql-with-ai", "Using AI for SQL", "Intermediate",
  "AI-assisted SQL with Google Gemini: writing effective prompts, generating SELECT, JOIN, subquery and aggregate queries, understanding and debugging AI output, dialect mistakes, verification in PostgreSQL, limitations, and privacy.",
  "fa-solid fa-robot", "Using AI for SQL", "A fast assistant that you must check",
  () => `
    ${section("1", "Introduction to AI-assisted SQL",
      p("AI assistants can turn a plain-language question into SQL, explain a query line by line, find a bug in it, or suggest a faster version. Used well, they save time on routine queries and help you learn. Used blindly, they produce confident, plausible and <strong>wrong</strong> SQL.") +
      callout("fa-solid fa-scale-balanced", "<p><strong>Golden rule:</strong> AI writes the first draft; <em>you</em> are responsible for the final query. You can only check an AI query if you understand SQL, which is why this topic comes <em>after</em> the rest of the course.</p>") +
      fig("sql_ai_workflow.png", "Workflow loop: describe the task and schema, AI drafts SQL, you read and understand it, run it on PostgreSQL, check the result, then refine the prompt") +
      p("Data: the shop tables (setup script in the WHERE topic).")
    )}

    ${section("2", "Introduction to Google Gemini",
      p("<strong>Gemini</strong> is Google's family of AI models and its chat assistant (at <code>gemini.google.com</code>, also built into Google products). It can generate and explain code, including SQL, and accept a pasted schema or even a screenshot of a table. The same approach works with other assistants (Claude, ChatGPT, Copilot); the skill is in how you ask and how you check.") +
      note("Availability:", "features, limits and model names change often. Check the current options in the app itself.")
    )}

    ${section("3", "Generating SQL queries: the basic workflow",
      numlist("", [
        ["Describe the schema", "table names, columns, types, keys: the AI cannot see your database."],
        ["State the question", "in clear business terms."],
        ["Name the dialect", "“PostgreSQL”, so you do not get MySQL or SQL Server syntax."],
        ["Read the answer", "understand every clause before running it."],
        ["Run and verify", "on PostgreSQL, against numbers you can check by hand."],
        ["Refine", "tell the AI what is wrong, with the error message or the unexpected result."],
      ])
    )}

    ${section("4", "Writing effective prompts",
      p("A good SQL prompt has four parts: <strong>Role</strong>, <strong>Context</strong> (the schema), <strong>Task</strong> and <strong>Format / constraints</strong>.") +
      codeBlock("Prompt template", `You are a PostgreSQL expert.

Schema:
customers(customer_id PK, customer_name, city, signup_date)
products(product_id PK, product_name, category, price)
orders(order_id PK, customer_id FK -> customers, order_date, status)
order_items(item_id PK, order_id FK -> orders, product_id FK -> products, quantity)

Task:
Show each customer's name and total amount spent on orders with status
'Delivered', highest spender first. Customers without delivered orders
should not appear.

Requirements:
- PostgreSQL syntax only
- use table aliases and explicit JOIN ... ON
- add a short comment for each clause
- explain the query in 3 bullet points after the code`, "fa-solid fa-comment-dots") +
      table(["Weak prompt", "Strong prompt"], [
        ["“sales query”", "States the exact result columns, filter, grouping and order"],
        ["No schema", "Pastes table and column names with keys"],
        ["“SQL”", "“PostgreSQL 16”"],
        ["Accepts the first answer", "Asks for an explanation and edge cases (NULLs, duplicates, ties)"],
      ]) +
      tip("ask the AI to “<strong>ask me clarifying questions first</strong>” when the request is ambiguous: does “revenue” include cancelled orders? Is a “month” a calendar month?")
    )}

    ${section("5", "Generating SELECT queries",
      p("<strong>Prompt:</strong> “List all Electronics products priced above 5,000, most expensive first.”") +
      ex("ai_select", `SELECT product_name, price
FROM products
WHERE category = 'Electronics'
  AND price > 5000
ORDER BY price DESC;`)
    )}

    ${section("6", "Generating JOIN queries",
      p("<strong>Prompt:</strong> “Each customer's name and total spent on delivered orders, highest first.” (the template above)") +
      ex("ai_join", `SELECT c.customer_name,
       SUM(oi.quantity * p.price) AS total_spent
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products p     ON p.product_id  = oi.product_id
WHERE o.status = 'Delivered'
GROUP BY c.customer_name
ORDER BY total_spent DESC;`) +
      p("<strong>You check:</strong> three joins, each on the right key pair; the <code>WHERE</code> filters delivered orders; one row per customer through <code>GROUP BY</code>. By hand, Ayesha has 20,000 + 55,000 + 5 × 150 = 75,750. ✔")
    )}

    ${section("7", "Generating subqueries",
      p("<strong>Prompt:</strong> “Customers who have never placed an order. Be careful with NULLs.”") +
      ex("ai_sub", `SELECT c.customer_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);`) +
      p("A good assistant picks <code>NOT EXISTS</code> over <code>NOT IN</code>, for the NULL reason you learned in the Subqueries topic. Asking for “careful with NULLs” helps; knowing <em>why</em> lets you confirm it did.")
    )}

    ${section("8", "Generating aggregate queries",
      p("<strong>Prompt:</strong> “Monthly revenue for 2026, excluding cancelled orders, with the number of orders per month.”") +
      ex("ai_agg", `SELECT DATE_TRUNC('month', o.order_date)::date AS month,
       COUNT(DISTINCT o.order_id)             AS orders,
       SUM(oi.quantity * p.price)             AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id  = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE o.status <> 'Cancelled'
  AND o.order_date >= '2026-01-01' AND o.order_date < '2027-01-01'
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month;`) +
      p("Note <code>COUNT(DISTINCT o.order_id)</code>: after joining to order lines, an order appears once per line, so a plain <code>COUNT(*)</code> would over-count. This is exactly the kind of detail an assistant sometimes misses.")
    )}

    ${section("9", "Understanding AI-generated SQL",
      numlist("", [
        ["Read it clause by clause", "in the logical order: FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY."],
        ["Check every table and column name", "against your real schema."],
        ["Check every join condition", "right keys? right join type (INNER vs LEFT)?"],
        ["Check the filters", "<code>&gt;</code> or <code>&gt;=</code>? inclusive dates? the right status values?"],
        ["Ask it to explain", "“Explain this query step by step and list its assumptions.”"],
      ])
    )}

    ${section("10", "Identifying syntax errors: dialect mix-ups",
      p("Most AI mistakes in PostgreSQL come from <strong>other dialects</strong> leaking in. Two real examples:") +
      ex("ai_err1", `SELECT TOP 3 product_name, price FROM products ORDER BY price DESC;`) +
      ex("ai_err2", `SELECT product_name, IFNULL(price, 0) FROM products;`) +
      table(["Looks like (MySQL / SQL Server / Oracle)", "PostgreSQL way"], [
        [c("SELECT TOP 5 ..."), c("... LIMIT 5") + " or " + c("FETCH FIRST 5 ROWS ONLY")],
        [c("IFNULL(x, 0)") + " / " + c("ISNULL(x, 0)") + " / " + c("NVL(x, 0)"), c("COALESCE(x, 0)")],
        [c("DATE_FORMAT(d, '%Y-%m')"), c("TO_CHAR(d, 'YYYY-MM')")],
        [c("DATEDIFF(day, a, b)"), c("b - a") + " (dates) or " + c("EXTRACT(DAY FROM b - a)")],
        [c("NOW() - INTERVAL 1 DAY"), c("NOW() - INTERVAL '1 day'") + " (quotes)"],
        [c("`column` (backticks)") + " / " + c("[column]"), "plain names, or double quotes " + c("\"column\"")],
        [c("AUTO_INCREMENT") + " / " + c("IDENTITY(1,1)"), c("GENERATED ALWAYS AS IDENTITY") + " or " + c("SERIAL")],
        [c("GROUP_CONCAT(x)") + " / " + c("LISTAGG"), c("STRING_AGG(x, ', ')")],
        [c("\"text\"") + " for strings", "text in single quotes " + c("'text'")],
      ])
    )}

    ${section("11", "Debugging incorrect SQL queries",
      p("Two kinds of problems: <strong>errors</strong> (the query does not run) and <strong>wrong results</strong> (it runs but the answer is wrong). The second is more dangerous because nothing warns you.") +
      sub("", "A query that runs but is wrong") +
      p("Suppose an AI draft lists customers with their orders but forgot the join condition:") +
      ex("ai_bug", `SELECT COUNT(*) AS rows_returned
FROM customers c, orders o;`) +
      p("We have 6 orders, so 6 rows were expected. 5 customers × 6 orders = <strong>30</strong>: a Cartesian product. The sanity check on the row count caught it. The fix:") +
      ex("ai_fix", `SELECT COUNT(*) AS rows_returned
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id;`) +
      sub("", "How to ask the AI for debugging help") +
      codeBlock("Debugging prompt", `This PostgreSQL query should return one row per order (6 rows) but returns 30.

[paste the query]

Schema: [paste tables and keys]

Find the problem, explain it, and give the corrected query.`, "fa-solid fa-bug") +
      p("Always include: the query, the schema, the <strong>exact error message</strong> or what you expected versus what you got.")
    )}

    ${section("12", "Optimising SQL queries with AI suggestions",
      p("Paste a slow query <strong>and its <code>EXPLAIN (ANALYZE)</code> output</strong> (with a sample, never the real data) and ask for index and rewrite suggestions. Typical good advice: add an index on a filtered or joined column, remove <code>SELECT *</code>, replace a function on an indexed column, replace a correlated subquery with a join.") +
      bullets([
        "Treat suggestions as <strong>hypotheses</strong>: create the index on a test database and compare <code>EXPLAIN</code> before and after.",
        "Check that the rewritten query returns <em>exactly the same rows</em> (compare row counts and a few values, or use <code>EXCEPT</code> both ways).",
        "Beware of advice that helps one query and hurts writes (too many indexes).",
      ])
    )}

    ${section("13", "Verifying AI-generated queries in PostgreSQL",
      codeBlock("Verification checklist", `[ ] Read and understood every clause
[ ] Table / column names exist (run it; "does not exist" errors tell you)
[ ] Joins use the correct keys; row count is what you expect
[ ] Spot-check 2-3 results against numbers you can compute by hand
[ ] Compare totals with an independent query or a known report
[ ] NULLs, duplicates and ties considered
[ ] For INSERT / UPDATE / DELETE: first as a SELECT, then inside BEGIN ... ROLLBACK
[ ] Ran on a test copy before production
[ ] EXPLAIN looks sensible on a large table`, "fa-solid fa-list-check") +
      ex("ai_verify", `-- independent check of the "total spent" example: delivered order lines, no joins to customers
SELECT SUM(oi.quantity * p.price) AS delivered_revenue
FROM orders o
JOIN order_items oi ON oi.order_id  = o.order_id
JOIN products p     ON p.product_id = oi.product_id
WHERE o.status = 'Delivered';`) +
      p("The per-customer totals (Ayesha 75,750 + Ali 61,000 + John 3,000) add up to this overall figure, so the two queries agree.")
    )}

    ${section("14", "Limitations of AI-generated SQL",
      bullets([
        "<strong>It cannot see your database.</strong> It may invent tables or columns that do not exist (“hallucination”).",
        "<strong>It does not know your business rules</strong>: what counts as an “active” customer or “revenue”.",
        "<strong>Dialect and version mix-ups</strong>, as seen above.",
        "<strong>Confident wording</strong> even when wrong; it may skip NULL, duplicate or time-zone edge cases.",
        "<strong>Inconsistent answers</strong>: the same prompt can give different SQL on another try.",
        "<strong>No responsibility</strong>: a destructive <code>DELETE</code> or <code>DROP</code> it suggests is yours to run or not.",
      ])
    )}

    ${section("15", "Database security and privacy while using AI tools",
      callout("fa-solid fa-user-shield", "<p><strong>Anything you paste into an AI tool leaves your computer.</strong> Check your organisation's policy and the tool's data-use settings before sharing anything real.</p>") +
      split("Do share", [
        "Table and column <strong>names</strong> (the schema).",
        "<strong>Synthetic or anonymised</strong> sample rows.",
        "Error messages with identifiers removed.",
        "<code>EXPLAIN</code> output without real values.",
      ], "Never share", [
        "Passwords, API keys, connection strings.",
        "Real customer, employee or patient data (names, phone numbers, Aadhaar / PAN, salaries).",
        "Confidential business figures.",
        "Production credentials, or give the AI a live database login.",
      ]) +
      tip("get into the habit of replacing real values with <code>'Customer A'</code>, <code>'XXXXX'</code> before you paste, and run the generated SQL yourself: the AI never needs access to your database.")
    )}
  `);

/* =========================================================================
   MODULE 11 — Practical projects (hands-on SQL practice)
   ========================================================================= */

//# db: pj1
topic("project-students", "Project 1: Student Management Database", "Beginner",
  "Build a complete student database: create tables with keys, insert and import records, update and delete data, retrieve student information and generate department-wise reports.",
  "fa-solid fa-user-graduate", "Project 1: Student Management Database", "Departments and students: from an empty database to reports",
  () => `
    ${section("", "Project brief",
      p("<strong>Goal:</strong> a small college database that stores departments and students, keeps the data valid with constraints, and answers the questions an administrator asks.") +
      table(["Step", "Skill practised"], [
        ["1. Create the database", "DDL, " + c("CREATE DATABASE")],
        ["2. Create the student and department tables", "Data types, " + c("CREATE TABLE")],
        ["3. Define primary and foreign keys", "Constraints, referential integrity"],
        ["4. Insert and import student records", c("INSERT") + ", " + c("COPY") + " / " + c("\\copy")],
        ["5. Update and delete records", c("UPDATE") + ", " + c("DELETE")],
        ["6. Retrieve student information", c("SELECT") + ", " + c("WHERE") + ", " + c("ORDER BY")],
        ["7. Generate department-wise reports", c("JOIN") + ", " + c("GROUP BY") + ", aggregates"],
      ]) +
      fig("sql_project1_erd.png", "Entity-relationship diagram: departments (dept_id PK, dept_name, hod_name) one-to-many to students (student_id PK, name, email, dept_id FK, birth_date, city, gpa, admission_year)")
    )}

    ${section("1", "Create the database",
      exn("p1_db", `CREATE DATABASE student_mgmt;
-- in psql:  \\c student_mgmt      in pgAdmin: right-click the new database -> Query Tool`, "Run once, on the postgres database")
    )}

    ${section("2–3", "Create the tables with keys and constraints",
      ex("p1_tables", `CREATE TABLE departments (
    dept_id    INTEGER PRIMARY KEY,
    dept_name  VARCHAR(40) NOT NULL UNIQUE,
    hod_name   VARCHAR(40)
);

CREATE TABLE students (
    student_id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_name    VARCHAR(50) NOT NULL,
    email           VARCHAR(60) UNIQUE,
    dept_id         INTEGER NOT NULL REFERENCES departments (dept_id),
    birth_date      DATE,
    city            VARCHAR(30),
    gpa             NUMERIC(3,2) CHECK (gpa BETWEEN 0 AND 10),
    admission_year  INTEGER
);`) +
      bullets([
        "<code>dept_id</code> is the <strong>primary key</strong> of departments and a <strong>foreign key</strong> in students: a student must belong to an existing department.",
        "<code>email</code> is <code>UNIQUE</code>; <code>gpa</code> must be between 0 and 10.",
      ])
    )}

    ${section("4", "Insert and import records",
      ex("p1_insert_dept", `INSERT INTO departments VALUES
    (1, 'Computer Science',  'Dr. Rao'),
    (2, 'Electronics',       'Dr. Iyer'),
    (3, 'Business Analytics','Dr. Mehta'),
    (4, 'Mechanical',        'Dr. Khan');`) +
      ex("p1_insert_students", `INSERT INTO students (student_name, email, dept_id, birth_date, city, gpa, admission_year) VALUES
    ('Ali Khan',        'ali@college.edu',      1, '2005-03-14', 'Hyderabad', 8.40, 2023),
    ('Ayesha Rao',      'ayesha@college.edu',   1, '2004-11-02', 'Hyderabad', 9.10, 2022),
    ('Ravi Kumar',      'ravi@college.edu',     2, '2005-07-21', 'Bengaluru', 7.60, 2023),
    ('John Mathew',     'john@college.edu',     3, '2004-01-30', 'Chennai',   8.80, 2022),
    ('Priya Sharma',    'priya@college.edu',    3, '2005-09-09', 'Mumbai',    9.40, 2023),
    ('Meena Iyer',      'meena@college.edu',    1, '2003-12-25', 'Chennai',   7.20, 2021),
    ('Karan Mehta',     'karan@college.edu',    2, '2005-05-17', 'Hyderabad', 6.90, 2023),
    ('Sara Fernandes',  'sara@college.edu',     3, '2004-04-04', 'Mumbai',    8.10, 2022);`) +
      p("Larger lists normally arrive as a CSV file. Import them with the staging approach from the Import topic (or directly when the file is clean):") +
      exn("p1_copy", `\\copy students (student_name, email, dept_id, birth_date, city, gpa, admission_year) FROM 'students.csv' WITH (FORMAT csv, HEADER true)`, "psql")
    )}

    ${section("5", "Update and delete records",
      ex("p1_update", `-- Karan moved to Bengaluru and improved his GPA
UPDATE students
SET city = 'Bengaluru', gpa = 7.40
WHERE email = 'karan@college.edu'
RETURNING student_id, student_name, city, gpa;`) +
      ex("p1_update2", `-- A new head of department
UPDATE departments SET hod_name = 'Dr. Nair' WHERE dept_id = 4;`) +
      ex("p1_delete", `-- Sara left the college
DELETE FROM students
WHERE email = 'sara@college.edu'
RETURNING student_id, student_name;`) +
      ex("p1_fk", `-- the foreign key protects departments that still have students
DELETE FROM departments WHERE dept_id = 1;`)
    )}

    ${section("6", "Retrieve student information",
      sub("", "All students of one department, best GPA first") +
      ex("p1_q1", `SELECT s.student_name, s.city, s.gpa
FROM students s
JOIN departments d ON d.dept_id = s.dept_id
WHERE d.dept_name = 'Computer Science'
ORDER BY s.gpa DESC;`) +
      sub("", "Top 3 students of the college") +
      ex("p1_q2", `SELECT student_name, gpa
FROM students
ORDER BY gpa DESC
LIMIT 3;`) +
      sub("", "Students from Hyderabad or Chennai with GPA of at least 8, with their age") +
      ex("p1_q3", `SELECT student_name, city, gpa,
       EXTRACT(YEAR FROM AGE(DATE '2026-11-06', birth_date)) AS age
FROM students
WHERE city IN ('Hyderabad', 'Chennai') AND gpa >= 8
ORDER BY student_name;`) +
      sub("", "Search by name") +
      ex("p1_q4", `SELECT student_name, email FROM students WHERE student_name ILIKE '%an%' ORDER BY student_name;`)
    )}

    ${section("7", "Department-wise reports",
      sub("", "Students and average GPA per department (including empty departments)") +
      ex("p1_r1", `SELECT d.dept_name,
       COUNT(s.student_id)          AS students,
       ROUND(AVG(s.gpa), 2)         AS avg_gpa,
       MAX(s.gpa)                   AS best_gpa
FROM departments d
LEFT JOIN students s ON s.dept_id = d.dept_id
GROUP BY d.dept_name
ORDER BY students DESC, d.dept_name;`) +
      sub("", "Admissions per year") +
      ex("p1_r2", `SELECT admission_year, COUNT(*) AS admitted
FROM students
GROUP BY admission_year
ORDER BY admission_year;`) +
      sub("", "Departments whose average GPA is above the college average") +
      ex("p1_r3", `SELECT d.dept_name, ROUND(AVG(s.gpa), 2) AS avg_gpa
FROM departments d
JOIN students s ON s.dept_id = d.dept_id
GROUP BY d.dept_name
HAVING AVG(s.gpa) > (SELECT AVG(gpa) FROM students)
ORDER BY avg_gpa DESC;`)
    )}

    ${section("", "Extension tasks",
      bullets([
        "Add a <code>courses</code> table and an <code>enrollments</code> table (composite primary key) to model many-to-many.",
        "Add a trigger that records every change of a student's GPA in an audit table.",
        "Create a read-only role for the department heads that can see only their students' names and GPA.",
        "Create an index on <code>students (dept_id)</code> and check the plan with <code>EXPLAIN</code>.",
      ])
    )}
  `);

//# db: pj2 emp
topic("project-employees", "Project 2: Employee Management Database", "Intermediate",
  "Work with employees and departments: store details and salaries, filter and sort, calculate department-wise salary with aggregates, apply every kind of join, and find employees earning above their department average.",
  "fa-solid fa-id-card-clip", "Project 2: Employee Management Database", "Salaries, departments and analysis",
  () => `
    ${section("", "Project brief",
      p("A company keeps employees and departments. HR wants reports on salaries, headcount and pay fairness. The tables are the ones used throughout the course (setup script in the SELECT topic):") +
      codeBlock("Setup script", SETUP_EMP) +
      fig("sql_project2_erd.png", "Entity-relationship diagram of departments and employees, with a self-reference from employees.manager_id to employees.emp_id")
    )}

    ${section("1", "Store employee details and salaries",
      p("New joiners arrive; add three employees. The third has no commission and no manager yet:") +
      ex("p2_insert", `INSERT INTO employees (emp_id, emp_name, dept_id, salary, hire_date, manager_id, city, commission) VALUES
    (109, 'Nisha Verma',  30, 72000, '2024-02-01', 103,  'Bengaluru', NULL),
    (110, 'Imran Sheikh', 10, 58000, '2024-04-15', 102,  'Hyderabad', 3000),
    (111, 'Deepa Nair',   20, 51000, '2024-08-20', NULL, 'Mumbai',    NULL)
RETURNING emp_id, emp_name, salary;`)
    )}

    ${section("2", "Filtering and sorting",
      sub("", "IT employees earning at least 70,000, highest first") +
      ex("p2_q1", `SELECT emp_name, salary
FROM employees
WHERE dept_id = 30 AND salary >= 70000
ORDER BY salary DESC;`) +
      sub("", "The five most recent joiners") +
      ex("p2_q2", `SELECT emp_name, hire_date
FROM employees
ORDER BY hire_date DESC
LIMIT 5;`) +
      sub("", "Employees without a commission whose name starts with a letter between A and M") +
      ex("p2_q3", `SELECT emp_name, commission
FROM employees
WHERE commission IS NULL AND emp_name < 'N'
ORDER BY emp_name;`)
    )}

    ${section("3–4", "Department-wise salary and aggregate functions",
      ex("p2_agg", `SELECT COALESCE(d.dept_name, '(no department)') AS department,
       COUNT(*)                     AS headcount,
       SUM(e.salary)                AS payroll,
       ROUND(AVG(e.salary), 2)      AS avg_salary,
       MIN(e.salary)                AS lowest,
       MAX(e.salary)                AS highest
FROM employees e
LEFT JOIN departments d ON d.dept_id = e.dept_id
GROUP BY d.dept_name
ORDER BY payroll DESC;`) +
      sub("", "Total pay including commission, per city") +
      ex("p2_city", `SELECT city,
       COUNT(*) AS employees,
       SUM(salary + COALESCE(commission, 0)) AS total_pay
FROM employees
GROUP BY city
HAVING COUNT(*) >= 2
ORDER BY total_pay DESC;`)
    )}

    ${section("5", "Apply the different types of joins",
      sub("", "INNER: employees with their department") +
      ex("p2_j1", `SELECT e.emp_name, d.dept_name, d.location
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
WHERE d.dept_name = 'HR'
ORDER BY e.emp_id;`) +
      sub("", "LEFT: every employee, even without a department") +
      ex("p2_j2", `SELECT e.emp_name, COALESCE(d.dept_name, 'Unassigned') AS department
FROM employees e
LEFT JOIN departments d ON d.dept_id = e.dept_id
WHERE d.dept_id IS NULL;`) +
      sub("", "RIGHT / LEFT with tables swapped: departments with no employees") +
      ex("p2_j3", `SELECT d.dept_name
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id
WHERE e.emp_id IS NULL;`) +
      sub("", "SELF: each employee with the manager's name") +
      ex("p2_j4", `SELECT e.emp_name AS employee, COALESCE(m.emp_name, '(top of the chart)') AS manager
FROM employees e
LEFT JOIN employees m ON m.emp_id = e.manager_id
ORDER BY e.emp_id;`) +
      sub("", "Number of direct reports per manager") +
      ex("p2_j5", `SELECT m.emp_name AS manager, COUNT(*) AS direct_reports
FROM employees e
JOIN employees m ON m.emp_id = e.manager_id
GROUP BY m.emp_name
ORDER BY direct_reports DESC, manager;`)
    )}

    ${section("6", "Find employees earning more than their department average",
      p("The classic correlated subquery:") +
      ex("p2_above", `SELECT e.emp_name, d.dept_name, e.salary
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
WHERE e.salary > (SELECT AVG(x.salary) FROM employees x WHERE x.dept_id = e.dept_id)
ORDER BY d.dept_name, e.salary DESC;`) +
      p("The same with a derived table, showing the average next to the salary:") +
      ex("p2_above2", `SELECT e.emp_name, d.dept_name, e.salary, ROUND(a.avg_salary, 2) AS avg_salary,
       ROUND(e.salary - a.avg_salary, 2) AS above_average_by
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
JOIN (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) a
     ON a.dept_id = e.dept_id
WHERE e.salary > a.avg_salary
ORDER BY above_average_by DESC;`)
    )}

    ${section("", "Extension tasks",
      bullets([
        "Give a 7% raise to every employee with more than 5 years of service (use a transaction to check first).",
        "Add the salary-audit trigger from the Triggers topic and watch the log.",
        "Write a query that lists the “salary rank” of each employee inside the department (hint: <code>RANK() OVER (PARTITION BY ...)</code>).",
      ])
    )}
  `);

//# db: pj3 shop
topic("project-sales", "Project 3: Sales and Order Management Database", "Advanced",
  "Customers, products, orders and order details: import sales data, calculate total sales and revenue, find top-selling products, build monthly sales reports with subqueries and joins, and add indexes for frequent queries.",
  "fa-solid fa-cart-shopping", "Project 3: Sales and Order Management", "From raw orders to a revenue dashboard",
  () => `
    ${section("", "Project brief",
      p("An online shop wants to know: how much did we sell, which products and customers matter, and how are we trending month by month? The four tables are the shop tables of the course (setup script in the WHERE topic):") +
      codeBlock("Setup script (shop)", SETUP_SHOP) +
      fig("sql_project3_erd.png", "Entity-relationship diagram of customers, orders, order_items and products with crow's foot one-to-many lines and order_items as the bridge between orders and products")
    )}

    ${section("1", "Create the tables",
      p("The script above creates <code>customers</code>, <code>products</code>, <code>orders</code> and <code>order_items</code> (the order-detail table) with primary keys, foreign keys and the identity of every order line.")
    )}

    ${section("2", "Import the sales data from CSV",
      p("New orders arrive as CSV exports. Load them into staging tables, check them, then insert (see the Import topic):") +
      exn("p3_copy", `\\copy orders      FROM 'orders_april.csv'      WITH (FORMAT csv, HEADER true)
\\copy order_items FROM 'order_items_april.csv' WITH (FORMAT csv, HEADER true)`, "psql") +
      p("For this exercise the file contents are inserted directly:") +
      ex("p3_import", `INSERT INTO orders VALUES
    (1007, 5, '2026-04-02', 'Delivered'),
    (1008, 3, '2026-04-15', 'Delivered'),
    (1009, 1, '2026-04-28', 'Shipped'),
    (1010, 2, '2026-05-06', 'Delivered');

INSERT INTO order_items VALUES
    (10, 1007, 2, 1),
    (11, 1007, 3, 1),
    (12, 1008, 1, 1),
    (13, 1009, 6, 2),
    (14, 1010, 4, 20),
    (15, 1010, 5, 50),
    (16, 1010, 3, 2);`) +
      ex("p3_check", `SELECT (SELECT COUNT(*) FROM orders)      AS orders,
       (SELECT COUNT(*) FROM order_items) AS order_lines;`)
    )}

    ${section("3", "Total sales and revenue",
      p("A <strong>view</strong> saves the join once; every report can then use it. Cancelled orders do not count as revenue:") +
      ex("p3_view", `CREATE VIEW order_lines AS
SELECT o.order_id, o.order_date, o.status, c.customer_id, c.customer_name, c.city,
       p.product_id, p.product_name, p.category,
       oi.quantity, p.price, oi.quantity * p.price AS line_total
FROM orders o
JOIN customers   c  ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id;`) +
      ex("p3_total", `SELECT COUNT(DISTINCT order_id)  AS orders,
       SUM(quantity)               AS units_sold,
       SUM(line_total)             AS revenue
FROM order_lines
WHERE status <> 'Cancelled';`) +
      ex("p3_aov", `SELECT ROUND(AVG(order_total), 2) AS average_order_value
FROM (SELECT order_id, SUM(line_total) AS order_total
      FROM order_lines
      WHERE status <> 'Cancelled'
      GROUP BY order_id) t;`) +
      ex("p3_cat", `SELECT category, SUM(quantity) AS units, SUM(line_total) AS revenue
FROM order_lines
WHERE status <> 'Cancelled'
GROUP BY category
ORDER BY revenue DESC;`)
    )}

    ${section("4", "Identify top-selling products",
      ex("p3_top_units", `SELECT product_name, SUM(quantity) AS units_sold
FROM order_lines
WHERE status <> 'Cancelled'
GROUP BY product_name
ORDER BY units_sold DESC
LIMIT 3;`, "By units") +
      ex("p3_top_rev", `SELECT product_name, SUM(line_total) AS revenue
FROM order_lines
WHERE status <> 'Cancelled'
GROUP BY product_name
ORDER BY revenue DESC
LIMIT 3;`, "By revenue") +
      p("Pens sell in huge numbers but a Laptop earns far more: <em>top-selling</em> depends on the measure, so always say which one.")
    )}

    ${section("5", "Monthly sales reports",
      ex("p3_month", `SELECT DATE_TRUNC('month', order_date)::date AS month,
       COUNT(DISTINCT order_id)               AS orders,
       SUM(line_total)                        AS revenue
FROM order_lines
WHERE status <> 'Cancelled'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`) +
      ex("p3_growth", `-- bonus: month-on-month growth with the window function LAG
SELECT month, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct
FROM (SELECT DATE_TRUNC('month', order_date)::date AS month, SUM(line_total) AS revenue
      FROM order_lines
      WHERE status <> 'Cancelled'
      GROUP BY 1) m
ORDER BY month;`)
    )}

    ${section("6", "Apply subqueries and joins",
      sub("", "Best customers: spend above the average customer") +
      ex("p3_cust", `SELECT customer_name, SUM(line_total) AS spent
FROM order_lines
WHERE status <> 'Cancelled'
GROUP BY customer_name
HAVING SUM(line_total) > (SELECT SUM(line_total) / COUNT(DISTINCT customer_id)
                          FROM order_lines WHERE status <> 'Cancelled')
ORDER BY spent DESC;`) +
      sub("", "Customers who have not ordered anything") +
      ex("p3_never", `SELECT customer_name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);`) +
      p("The result is empty now: Priya, the only customer without an order in the original data, placed one in April. A good report returns “no rows” when there is nothing to fix.") +
      sub("", "Cancelled and still-open orders that need attention") +
      ex("p3_open", `SELECT order_id, customer_name, status, SUM(line_total) AS value
FROM order_lines
WHERE status IN ('Shipped', 'Cancelled')
GROUP BY order_id, customer_name, status
ORDER BY order_id;`)
    )}

    ${section("7", "Create indexes for frequently executed queries",
      p("Reports join and filter on the foreign keys and the order date. PostgreSQL does <strong>not</strong> index foreign-key columns automatically, so add them:") +
      ex("p3_index", `CREATE INDEX idx_orders_customer    ON orders (customer_id);
CREATE INDEX idx_orders_date        ON orders (order_date);
CREATE INDEX idx_items_order        ON order_items (order_id);
CREATE INDEX idx_items_product      ON order_items (product_id);`) +
      ex("p3_index_list", `SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;`) +
      note("Remember:", "with only 10 orders PostgreSQL will still prefer a sequential scan; the indexes pay off at thousands or millions of rows (see the Indexing topic).")
    )}
  `);

//# db: pj4
topic("project-analytics", "Project 4: SQL Business Analytics", "Advanced",
  "Work with a realistic, messy business dataset: clean the data with SQL, handle missing values and duplicates, build management reports, calculate KPIs and analyse sales, customers and employee performance.",
  "fa-solid fa-chart-line", "Project 4: SQL Business Analytics", "From messy data to management insight",
  () => `
    ${section("", "Project brief",
      p("The sales team exported a year-to-date file. It is typical: inconsistent spelling, missing values, a duplicated transaction and an impossible quantity. Your job: clean it, trust it, then report on it.") +
      fig("sql_project4_pipeline.png", "Pipeline diagram: raw sales -> clean -> validate -> reporting tables -> KPIs and charts") +
      p("The raw data (loaded as it came, every problem included):") +
      ex("p4_raw", `CREATE TABLE raw_sales (
    txn_id         INTEGER,
    txn_date       DATE,
    customer_name  TEXT,
    region         TEXT,
    sales_rep      TEXT,
    category       TEXT,
    quantity       INTEGER,
    unit_price     NUMERIC(10,2),
    discount_pct   NUMERIC(5,2)
);

INSERT INTO raw_sales VALUES
    (1001, '2026-01-05', '  ali khan',      'South',   'Ravi Kumar', 'Electronics', 1,    55000, 5),
    (1002, '2026-01-12', 'AYESHA RAO',      'south ',  'Ravi Kumar', 'Electronics', 2,    20000, NULL),
    (1003, '2026-01-20', 'Ravi Kumar',      'NORTH',   'Meena Iyer', 'Furniture',   1,    7500,  0),
    (1004, '2026-02-03', 'John Mathew',     'North',   'Meena Iyer', 'Stationery',  10,   150,   NULL),
    (1005, '2026-02-10', 'priya sharma',    'West',    'John Mathew','Electronics', 1,    3000,  10),
    (1005, '2026-02-10', 'priya sharma',    'West',    'John Mathew','Electronics', 1,    3000,  10),
    (1006, '2026-02-18', 'Ali Khan',        'South',   'Ravi Kumar', 'Furniture',   2,    7500,  0),
    (1007, '2026-02-25', 'Karan Mehta ',    'west',    'John Mathew','Stationery',  20,   20,    NULL),
    (1008, '2026-03-02', 'Sara Fernandes',  'West',    'John Mathew','Electronics', NULL, 20000, 0),
    (1009, '2026-03-09', 'AYESHA RAO',      'South',   'Ravi Kumar', 'Electronics', 1,    55000, 5),
    (1010, '2026-03-15', 'Meena Iyer',      'North',   'Meena Iyer', 'Electronics', -1,   3000,  0),
    (1011, '2026-03-21', 'John Mathew',     'North',   'Meena Iyer', 'Electronics', 3,    3000,  10),
    (1012, '2026-03-28', 'ali khan',        'South',   'Ravi Kumar', 'Stationery',  5,    150,   NULL);`)
    )}

    ${section("1", "Profile the data first",
      p("Before changing anything, measure the problems:") +
      ex("p4_profile", `SELECT COUNT(*)                         AS rows_total,
       COUNT(DISTINCT txn_id)              AS distinct_transactions,
       COUNT(*) FILTER (WHERE quantity IS NULL)      AS missing_quantity,
       COUNT(*) FILTER (WHERE quantity <= 0)         AS invalid_quantity,
       COUNT(*) FILTER (WHERE discount_pct IS NULL)  AS missing_discount
FROM raw_sales;`) +
      ex("p4_regions", `SELECT region, COUNT(*) AS rows
FROM raw_sales
GROUP BY region
ORDER BY region;`) +
      p("“South”, “south ” and “SOUTH” are being treated as different regions, which would split every report. Duplicates: ") +
      ex("p4_dups", `SELECT txn_id, COUNT(*) AS copies
FROM raw_sales
GROUP BY txn_id
HAVING COUNT(*) > 1;`)
    )}

    ${section("2", "Clean the data with SQL",
      p("Rules: trim and fix capitals on names and regions; treat a missing discount as 0; remove exact duplicate rows; keep rows with a missing or non-positive quantity <em>out</em> of the reports but <em>in a reject table</em> for follow-up.") +
      ex("p4_clean", `CREATE TABLE sales_clean AS
SELECT DISTINCT
       txn_id,
       txn_date,
       INITCAP(TRIM(customer_name))   AS customer_name,
       INITCAP(TRIM(region))          AS region,
       sales_rep,
       category,
       quantity,
       unit_price,
       COALESCE(discount_pct, 0)      AS discount_pct
FROM raw_sales
WHERE quantity > 0;                   -- drops NULL and negative quantities

ALTER TABLE sales_clean ADD PRIMARY KEY (txn_id);`) +
      ex("p4_rejects", `CREATE TABLE sales_rejects AS
SELECT txn_id, customer_name, quantity,
       CASE WHEN quantity IS NULL THEN 'missing quantity' ELSE 'quantity not positive' END AS reason
FROM raw_sales
WHERE quantity IS NULL OR quantity <= 0;

SELECT * FROM sales_rejects ORDER BY txn_id;`) +
      ex("p4_verify", `SELECT (SELECT COUNT(*) FROM raw_sales)                    AS raw_rows,
       (SELECT COUNT(*) FROM sales_clean)                  AS clean_rows,
       (SELECT COUNT(*) FROM sales_rejects)                AS rejected_rows,
       (SELECT COUNT(DISTINCT txn_id) FROM raw_sales)      AS distinct_txn;`) +
      p("13 raw rows − 1 duplicate − 2 rejected = 10 clean rows. The numbers reconcile, and every row is accounted for.") +
      ex("p4_regions2", `SELECT region, COUNT(*) AS rows FROM sales_clean GROUP BY region ORDER BY region;`)
    )}

    ${section("3", "Handle missing values deliberately",
      table(["Situation", "Choice made", "Why"], [
        ["Missing discount", c("COALESCE(discount_pct, 0)"), "No discount recorded means none was given"],
        ["Missing quantity", "Reject and report", "Revenue cannot be guessed"],
        ["Negative quantity", "Reject and report", "Probably a return: needs a business decision"],
      ]) +
      tip("document every cleaning rule. Two analysts cleaning the same file differently will report different revenue.")
    )}

    ${section("4", "Management report: sales summary",
      p("Net revenue = quantity × unit price × (1 − discount%):") +
      ex("p4_kpi", `SELECT COUNT(*)                                                     AS transactions,
       SUM(quantity)                                                  AS units,
       ROUND(SUM(quantity * unit_price), 2)                           AS gross_revenue,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS net_revenue,
       ROUND(SUM(quantity * unit_price * (discount_pct / 100)), 2)    AS discounts_given,
       ROUND(AVG(quantity * unit_price * (1 - discount_pct / 100)), 2) AS avg_transaction_value
FROM sales_clean;`)
    )}

    ${section("5", "Calculate KPIs by region and category",
      ex("p4_region", `SELECT region,
       COUNT(*) AS transactions,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS net_revenue,
       ROUND(100.0 * SUM(quantity * unit_price * (1 - discount_pct / 100))
             / SUM(SUM(quantity * unit_price * (1 - discount_pct / 100))) OVER (), 1) AS share_pct
FROM sales_clean
GROUP BY region
ORDER BY net_revenue DESC;`) +
      ex("p4_cat", `SELECT category,
       SUM(quantity) AS units,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS net_revenue,
       ROUND(AVG(discount_pct), 1) AS avg_discount_pct
FROM sales_clean
GROUP BY category
ORDER BY net_revenue DESC;`)
    )}

    ${section("6", "Customer analysis",
      p("Customer segments with <code>CASE</code>:") +
      ex("p4_cust", `SELECT customer_name,
       COUNT(*) AS orders,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS spent,
       CASE WHEN SUM(quantity * unit_price * (1 - discount_pct / 100)) >= 50000 THEN 'High value'
            WHEN SUM(quantity * unit_price * (1 - discount_pct / 100)) >= 10000 THEN 'Medium'
            ELSE 'Low' END AS segment
FROM sales_clean
GROUP BY customer_name
ORDER BY spent DESC;`) +
      ex("p4_repeat", `SELECT COUNT(*) FILTER (WHERE orders > 1) AS repeat_customers,
       COUNT(*)                            AS all_customers,
       ROUND(100.0 * COUNT(*) FILTER (WHERE orders > 1) / COUNT(*), 1) AS repeat_rate_pct
FROM (SELECT customer_name, COUNT(*) AS orders FROM sales_clean GROUP BY customer_name) c;`)
    )}

    ${section("7", "Employee (sales representative) performance",
      ex("p4_reps", `SELECT sales_rep,
       COUNT(*)  AS deals,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS net_revenue,
       ROUND(AVG(discount_pct), 1) AS avg_discount_pct,
       RANK() OVER (ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100)) DESC) AS revenue_rank
FROM sales_clean
GROUP BY sales_rep
ORDER BY revenue_rank;`) +
      p("<code>RANK() OVER (...)</code> is a <strong>window function</strong>: it ranks the rows without collapsing them, and is worth learning next.")
    )}

    ${section("8", "Monthly trend",
      ex("p4_trend", `SELECT TO_CHAR(txn_date, 'YYYY-MM') AS month,
       COUNT(*) AS transactions,
       ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100)), 2) AS net_revenue
FROM sales_clean
GROUP BY TO_CHAR(txn_date, 'YYYY-MM')
ORDER BY month;`) +
      real("this last block is a management report: the numbers an executive reads on one page. Everything above it, the profiling, cleaning rules and reconciliation, is what makes those numbers <em>trustworthy</em>.")
    )}

    ${section("", "Extension tasks",
      bullets([
        "Turn the cleaning steps into a reusable script (<code>clean_sales.sql</code>) and run it on next month's file.",
        "Create a view <code>v_sales_report</code> that adds a <code>net_revenue</code> column, so reports stop repeating the formula.",
        "Add <code>CHECK</code> and <code>NOT NULL</code> constraints to <code>sales_clean</code> so bad rows can never enter again.",
        "Connect Power BI, Excel or Python (<code>pandas.read_sql</code>) to PostgreSQL and chart these queries.",
      ])
    )}
  `);

/* =========================================================================
   MODULE 11 (continued) — Job interview preparation
   ========================================================================= */

//# db: iv emp
topic("interview-prep", "Job Interview Preparation", "Intermediate",
  "The most asked SQL interview questions with crisp answers: DELETE vs DROP vs TRUNCATE, WHERE vs HAVING, PRIMARY KEY vs UNIQUE, joins, UNION, subquery vs JOIN, data types, indexes, ACID, query-writing exercises, problem solving and database design.",
  "fa-solid fa-briefcase", "Job Interview Preparation", "Questions you will meet, and how to answer them",
  () => `
    ${section("1", "How SQL interviews work",
      p("Most SQL interviews have three parts: <strong>concept questions</strong> (“what is the difference between…?”), <strong>live query writing</strong> on a small schema, and a <strong>design or problem-solving</strong> discussion. Interviewers care less about memorised syntax than about whether you <em>think clearly</em>: clarify the question, state your assumptions, write a simple correct query first, then improve it.") +
      bullets([
        "Say your reasoning aloud: “I need orders joined to customers, filtered to delivered, grouped by customer.”",
        "Ask about NULLs, duplicates, ties and date ranges before you write.",
        "Test your query mentally on two or three rows.",
        "It is fine to say “in PostgreSQL I would write…”; knowing dialect differences is a plus.",
      ]) +
      p("Query exercises below run on the <code>employees</code> / <code>departments</code> tables (setup script in the SELECT topic) and the shop tables (WHERE topic).")
    )}

    ${section("2", "Frequently asked SQL interview questions",
      table(["Question", "Short answer"], [
        ["What is SQL?", "The standard language for defining, changing, querying and controlling data in relational databases."],
        ["What is a primary key?", "A column (or set) that uniquely identifies each row: unique and not null; one per table."],
        ["What is a foreign key?", "A column referring to another table's key; it enforces referential integrity."],
        ["What is NULL?", "“Unknown / missing”, not zero or empty text. Compare with " + c("IS NULL") + "; any arithmetic or comparison with it gives NULL."],
        ["What is normalisation?", "Organising tables to remove redundancy and update problems (1NF, 2NF, 3NF)."],
        ["What is a view?", "A saved query that behaves like a virtual table."],
        ["What is a constraint?", "A rule enforced by the database: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT."],
        ["What is the order of execution?", "FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT."],
        ["What does COUNT(*) vs COUNT(col) do?", "COUNT(*) counts all rows; COUNT(col) skips NULLs."],
        ["How do you find duplicates?", c("GROUP BY col HAVING COUNT(*) > 1") + "."],
        ["What is a self join?", "Joining a table to itself with two aliases, e.g. employee → manager."],
        ["What is a CTE?", "A named temporary result, " + c("WITH name AS (SELECT ...)") + ", that makes complex queries readable."],
      ])
    )}

    ${section("3", "DELETE vs DROP vs TRUNCATE",
      table(["", "DELETE", "TRUNCATE", "DROP"], [
        ["Type", "DML", "DDL", "DDL"],
        ["Removes", "Rows (all or filtered)", "All rows", "Table, with its data and structure"],
        ["WHERE", "Yes", "No", "No"],
        ["Speed", "Slower", "Fast", "Fast"],
        ["Rollback in PostgreSQL", "Yes", "Yes (in a transaction)", "Yes (in a transaction)"],
        ["Resets identity", "No", "With " + c("RESTART IDENTITY"), "n/a"],
      ])
    )}

    ${section("4", "WHERE vs HAVING",
      table(["", "WHERE", "HAVING"], [
        ["Filters", "Rows, before grouping", "Groups, after grouping"],
        ["Aggregates allowed", "No", "Yes"],
        ["Example", c("WHERE salary > 50000"), c("HAVING COUNT(*) > 2")],
      ]) +
      p("Use both together: <em>“for employees earning over 50,000 (WHERE), show departments with more than 2 of them (HAVING).”</em>")
    )}

    ${section("5", "PRIMARY KEY vs UNIQUE",
      table(["", "PRIMARY KEY", "UNIQUE"], [
        ["NULL values", "Not allowed", "Allowed (several)"],
        ["Per table", "One", "Many"],
        ["Purpose", "Identify rows; target of foreign keys", "Prevent duplicates in other columns (email, GST no.)"],
        ["Index", "Created automatically", "Created automatically"],
      ])
    )}

    ${section("6", "INNER JOIN vs LEFT JOIN",
      table(["", "INNER JOIN", "LEFT JOIN"], [
        ["Returns", "Only rows that match in both tables", "All rows of the left table; NULLs where the right has no match"],
        ["Unmatched left rows", "Dropped", "Kept"],
        ["Use for", "Related data that must exist on both sides", "Optional relationships; finding missing partners (" + c("WHERE right.key IS NULL") + ")"],
      ])
    )}

    ${section("7", "UNION vs UNION ALL",
      table(["", "UNION", "UNION ALL"], [
        ["Duplicates", "Removed", "Kept"],
        ["Speed", "Slower (sorts / hashes)", "Faster"],
        ["Rule", "Same number of columns and compatible types", "Same"],
      ])
    )}

    ${section("8", "Subquery vs JOIN",
      table(["", "Subquery", "JOIN"], [
        ["Purpose", "Filter or compute a value, then use it", "Combine columns from several tables"],
        ["Columns from the second table", "Not available outside the subquery", "Available"],
        ["Risk", "NOT IN with NULL gives no rows", "Duplicated rows on one-to-many joins"],
        ["Performance", "Often the same: the planner may rewrite either", "Often the same"],
      ])
    )}

    ${section("9", "CHAR vs VARCHAR vs TEXT",
      table(["", "CHAR(n)", "VARCHAR(n)", "TEXT"], [
        ["Length", "Fixed, space-padded to n", "Variable, up to n", "Variable, unlimited"],
        ["Typical use", "Constant-length codes", "Names, emails with a real limit", "Free text"],
        ["PostgreSQL note", "Padding costs space", "Same speed as TEXT", "Same speed as VARCHAR"],
      ])
    )}

    ${section("10", "What are indexes?",
      p("Separate sorted structures (usually B-trees) that let the database find rows without scanning the whole table. They speed up <code>WHERE</code>, <code>JOIN</code> and <code>ORDER BY</code> on the indexed columns, but use disk space and slow down <code>INSERT</code> / <code>UPDATE</code> / <code>DELETE</code>. Typical follow-ups: “which columns would you index?” (searched, joined and foreign-key columns) and “how do you check whether an index is used?” (<code>EXPLAIN</code>).")
    )}

    ${section("11", "What are transactions and ACID properties?",
      p("A transaction is a group of statements executed as one unit (<code>BEGIN … COMMIT / ROLLBACK</code>). ACID: <strong>Atomicity</strong> (all or nothing), <strong>Consistency</strong> (constraints always hold), <strong>Isolation</strong> (concurrent transactions do not see each other's unfinished work), <strong>Durability</strong> (committed data survives crashes). Illustrate with a bank transfer: debit and credit succeed or fail together.")
    )}

    ${section("12", "Query-writing interview exercises",
      p("Try each one yourself before reading the answer.") +
      sub("Q1.", "Second-highest salary") +
      ex("iv_q1", `SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`) +
      p("<code>DISTINCT</code> handles ties; the same pattern gives the Nth highest (<code>OFFSET N-1</code>). The subquery version is <code>WHERE salary &lt; (SELECT MAX(salary) …)</code>.") +
      sub("Q2.", "Employees with no department") +
      ex("iv_q2", `SELECT emp_name
FROM employees
WHERE dept_id IS NULL;`) +
      sub("Q3.", "Departments with more than two employees") +
      ex("iv_q3", `SELECT d.dept_name, COUNT(*) AS employees
FROM employees e
JOIN departments d ON d.dept_id = e.dept_id
GROUP BY d.dept_name
HAVING COUNT(*) > 2
ORDER BY d.dept_name;`) +
      sub("Q4.", "The highest-paid employee in each department") +
      ex("iv_q4", `SELECT e.dept_id, e.emp_name, e.salary
FROM employees e
WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE dept_id = e.dept_id)
ORDER BY e.dept_id;`) +
      sub("Q5.", "Find and delete duplicate rows") +
      ex("iv_q5a", `CREATE TABLE contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
INSERT INTO contacts VALUES
    (1, 'Ali',    'ali@example.com'),
    (2, 'Ayesha', 'ayesha@example.com'),
    (3, 'Ali K.', 'ali@example.com'),
    (4, 'Ravi',   'ravi@example.com'),
    (5, 'Ali',    'ali@example.com');

SELECT email, COUNT(*) AS copies
FROM contacts
GROUP BY email
HAVING COUNT(*) > 1;`, "Find duplicates") +
      ex("iv_q5b", `DELETE FROM contacts a
USING contacts b
WHERE a.email = b.email
  AND a.id > b.id;

SELECT * FROM contacts ORDER BY id;`, "Keep only the lowest id of each email") +
      sub("Q6.", "Employees who earn more than their manager") +
      ex("iv_q6", `SELECT e.emp_name, e.salary, m.emp_name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary
ORDER BY e.emp_id;`) +
      sub("Q7.", "Customers who ordered in January and again in March (shop data)") +
      /*# db: iv2 shop */ "" +
      ex("iv_q7", `SELECT c.customer_name
FROM customers c
WHERE c.customer_id IN (
        SELECT customer_id FROM orders
        WHERE order_date >= '2026-01-01' AND order_date < '2026-02-01'
      INTERSECT
        SELECT customer_id FROM orders
        WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01');`) +
      sub("Q8.", "Order counts per customer split by status (conditional aggregation)") +
      ex("iv_q8", `SELECT c.customer_name,
       COUNT(*) FILTER (WHERE o.status = 'Delivered') AS delivered,
       COUNT(*) FILTER (WHERE o.status = 'Shipped')   AS shipped,
       COUNT(*) FILTER (WHERE o.status = 'Cancelled') AS cancelled
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_name
ORDER BY c.customer_name;`) +
      p("A frequent next question is “same result without <code>FILTER</code>”: <code>SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END)</code> works in every database.")
    )}

    ${section("13", "Real-world SQL problem solving: a method",
      numlist("", [
        ["Restate the question", "in your own words; list the output columns."],
        ["Find the tables", "which tables hold each piece of data? How are they linked?"],
        ["Decide the grain", "one row per what? (per customer, per order, per month)"],
        ["Join", "start small, add one table at a time, check the row count."],
        ["Filter", "<code>WHERE</code> for rows, <code>HAVING</code> for groups. Watch statuses, date ranges, NULLs."],
        ["Aggregate", "<code>GROUP BY</code> at the grain you chose."],
        ["Sort and limit", "<code>ORDER BY</code>, <code>LIMIT</code>, a deterministic tie-break."],
        ["Sanity check", "compare with a manual calculation on a few rows."],
      ])
    )}

    ${section("14", "Database design questions",
      sub("", "Normalisation in one example") +
      table(["Form", "Rule", "Violation example", "Fix"], [
        ["<strong>1NF</strong>", "Each cell holds one atomic value; no repeating groups", c("phones = '98765, 91234'"), "One row per phone, or a " + c("phones") + " table"],
        ["<strong>2NF</strong>", "1NF + every non-key column depends on the <em>whole</em> key", "In " + c("order_items(order_id, product_id, product_name)") + ", product_name depends only on product_id", "Move product data to " + c("products")],
        ["<strong>3NF</strong>", "2NF + no column depends on another non-key column", c("employees(emp_id, dept_id, dept_name)") + ": dept_name depends on dept_id", "Keep dept_name only in " + c("departments")],
      ]) +
      sub("", "Questions to expect") +
      table(["Question", "Good answer"], [
        ["Design tables for an online shop", c("customers") + ", " + c("products") + ", " + c("orders") + " (many per customer), " + c("order_items") + " (bridge between orders and products, storing quantity and the price at purchase time). Primary keys everywhere, foreign keys, " + c("NOT NULL") + " / " + c("CHECK") + " rules, indexes on foreign keys."],
        ["Natural key or surrogate key?", "A surrogate (identity) key never changes and is compact; keep natural identifiers (email, GST no.) with " + c("UNIQUE") + "."],
        ["How do you model many-to-many?", "A junction table with two foreign keys (and often a composite primary key)."],
        ["Why store the price in order_items?", "Product prices change; the order must remember what the customer actually paid."],
        ["When would you denormalise?", "For read-heavy reporting where joins are too slow, accepting duplicated data and extra update work."],
        ["How do you handle deletes?", c("ON DELETE") + " rules (RESTRICT / CASCADE / SET NULL); soft deletes (" + c("is_active") + ") to keep history."],
        ["OLTP vs OLAP?", "OLTP: many small transactions (orders), normalised. OLAP: big analytical queries, often denormalised (star schema)."],
      ])
    )}

    ${section("15", "Writing SQL from business requirements",
      p("Translate the sentence word by word:") +
      table(["Phrase in the requirement", "SQL part"], [
        ["“total”, “number of”, “average”", c("SUM") + ", " + c("COUNT") + ", " + c("AVG")],
        ["“for each customer / per month”", c("GROUP BY")],
        ["“only delivered orders”, “in 2026”", c("WHERE")],
        ["“only customers with more than…”", c("HAVING")],
        ["“highest first”, “top 3”", c("ORDER BY ... DESC LIMIT 3")],
        ["“who never…”, “without any…”", c("LEFT JOIN ... IS NULL") + " or " + c("NOT EXISTS")],
        ["“both A and B”, “A but not B”", c("INTERSECT") + ", " + c("EXCEPT") + " or two " + c("EXISTS")],
      ]) +
      p("<strong>Requirement:</strong> <em>“Show the top 2 customers by revenue from delivered orders, with the number of orders.”</em>") +
      ex("iv_req", `SELECT c.customer_name,
       COUNT(DISTINCT o.order_id)   AS orders,
       SUM(oi.quantity * p.price)   AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products p     ON p.product_id  = oi.product_id
WHERE o.status = 'Delivered'
GROUP BY c.customer_name
ORDER BY revenue DESC
LIMIT 2;`) +
      real("walk the interviewer through it in this order: tables, joins, filter, grouping, ordering. A clear explanation of a correct, simple query beats a clever query that you cannot explain.")
    )}

    ${section("", "Final checklist before the interview",
      bullets([
        "Write, by hand, joins, <code>GROUP BY</code> with <code>HAVING</code>, a correlated subquery and a self join without looking at notes.",
        "Know the difference tables above by heart (DELETE/DROP/TRUNCATE, WHERE/HAVING, UNION/UNION ALL, INNER/LEFT).",
        "Be able to explain NULL behaviour, indexes, transactions and normalisation in two sentences each.",
        "Have one project (like Project 3 or 4) you can describe end to end: the data, the problems, the queries, the findings.",
      ])
    )}
  `);


})();