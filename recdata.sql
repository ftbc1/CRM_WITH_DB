PGDMP                      }            postgres    17.5    17.5 L    Ç           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ü           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            é           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            â           1262    5    postgres    DATABASE     {   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE postgres;
                     postgres    false            ä           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    4995            Y           1247    16558    account_type_enum    TYPE     l   CREATE TYPE public.account_type_enum AS ENUM (
    'Client',
    'Partner',
    'Vendor',
    'Internal'
);
 $   DROP TYPE public.account_type_enum;
       public               postgres    false            \           1247    16568    project_status_enum    TYPE     ç   CREATE TYPE public.project_status_enum AS ENUM (
    'Planning',
    'In Progress',
    'On Hold',
    'Completed',
    'Cancelled'
);
 &   DROP TYPE public.project_status_enum;
       public               postgres    false            _           1247    16580    task_status_enum    TYPE     m   CREATE TYPE public.task_status_enum AS ENUM (
    'To Do',
    'In Progress',
    'In Review',
    'Done'
);
 #   DROP TYPE public.task_status_enum;
       public               postgres    false            b           1247    16590    update_type_enum    TYPE     »   CREATE TYPE public.update_type_enum AS ENUM (
    'Weekly Summary',
    'Meeting Notes',
    'Milestone',
    'Blocker',
    'Call',
    'Email',
    'Meeting',
    'Note'
);
 #   DROP TYPE public.update_type_enum;
       public               postgres    false            ▄            1259    16610    accounts    TABLE     G  CREATE TABLE public.accounts (
    id integer NOT NULL,
    airtable_id character varying(20),
    account_name character varying(255) NOT NULL,
    account_description text,
    account_owner_id integer,
    account_type public.account_type_enum,
    owner_id integer,
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.accounts;
       public         heap r       postgres    false    857            █            1259    16609    accounts_id_seq    SEQUENCE     ç   CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.accounts_id_seq;
       public               postgres    false    220            à           0    0    accounts_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;
          public               postgres    false    219            ▐            1259    16627    projects    TABLE     ƒ  CREATE TABLE public.projects (
    id integer NOT NULL,
    airtable_id character varying(20),
    project_name character varying(255) NOT NULL,
    project_description text,
    account_id integer NOT NULL,
    project_owner_id integer,
    project_status public.project_status_enum,
    project_value numeric(12,2),
    start_date date,
    end_date date,
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.projects;
       public         heap r       postgres    false    860            ▌            1259    16626    projects_id_seq    SEQUENCE     ç   CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.projects_id_seq;
       public               postgres    false    222            å           0    0    projects_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;
          public               postgres    false    221            α            1259    16649    tasks    TABLE     r  CREATE TABLE public.tasks (
    id integer NOT NULL,
    airtable_id character varying(20),
    task_name character varying(255) NOT NULL,
    description text,
    status public.task_status_enum,
    due_date date,
    project_id integer NOT NULL,
    assigned_to_id integer,
    created_by_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.tasks;
       public         heap r       postgres    false    863            ▀            1259    16648    tasks_id_seq    SEQUENCE     ä   CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.tasks_id_seq;
       public               postgres    false    224            ç           0    0    tasks_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;
          public               postgres    false    223            Σ            1259    16703    update_attachments    TABLE     )  CREATE TABLE public.update_attachments (
    id integer NOT NULL,
    update_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    file_type character varying(100),
    file_size_bytes integer,
    created_at timestamp with time zone DEFAULT now()
);
 &   DROP TABLE public.update_attachments;
       public         heap r       postgres    false            π            1259    16702    update_attachments_id_seq    SEQUENCE     æ   CREATE SEQUENCE public.update_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.update_attachments_id_seq;
       public               postgres    false    228            ê           0    0    update_attachments_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.update_attachments_id_seq OWNED BY public.update_attachments.id;
          public               postgres    false    227            Γ            1259    16676    updates    TABLE     M  CREATE TABLE public.updates (
    id integer NOT NULL,
    airtable_id character varying(20),
    notes text NOT NULL,
    date date NOT NULL,
    update_type public.update_type_enum,
    project_id integer NOT NULL,
    task_id integer,
    update_owner_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.updates;
       public         heap r       postgres    false    866            ß            1259    16675    updates_id_seq    SEQUENCE     å   CREATE SEQUENCE public.updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.updates_id_seq;
       public               postgres    false    226            ë           0    0    updates_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.updates_id_seq OWNED BY public.updates.id;
          public               postgres    false    225            ┌            1259    16600    users    TABLE     ╗   CREATE TABLE public.users (
    id integer NOT NULL,
    airtable_id character varying(20),
    user_name character varying(255),
    created_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap r       postgres    false            ┘            1259    16599    users_id_seq    SEQUENCE     ä   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            è           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            ¡           2604    16613    accounts id    DEFAULT     j   ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);
 :   ALTER TABLE public.accounts ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            »           2604    16630    projects id    DEFAULT     j   ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);
 :   ALTER TABLE public.projects ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            ▒           2604    16652    tasks id    DEFAULT     d   ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);
 7   ALTER TABLE public.tasks ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            ╡           2604    16706    update_attachments id    DEFAULT     ~   ALTER TABLE ONLY public.update_attachments ALTER COLUMN id SET DEFAULT nextval('public.update_attachments_id_seq'::regclass);
 D   ALTER TABLE public.update_attachments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            │           2604    16679 
   updates id    DEFAULT     h   ALTER TABLE ONLY public.updates ALTER COLUMN id SET DEFAULT nextval('public.updates_id_seq'::regclass);
 9   ALTER TABLE public.updates ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            ½           2604    16603    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            u          0    16610    accounts 
   TABLE DATA           î   COPY public.accounts (id, airtable_id, account_name, account_description, account_owner_id, account_type, owner_id, created_at) FROM stdin;
    public               postgres    false    220            w          0    16627    projects 
   TABLE DATA           ╡   COPY public.projects (id, airtable_id, project_name, project_description, account_id, project_owner_id, project_status, project_value, start_date, end_date, created_at) FROM stdin;
    public               postgres    false    222            y          0    16649    tasks 
   TABLE DATA           æ   COPY public.tasks (id, airtable_id, task_name, description, status, due_date, project_id, assigned_to_id, created_by_id, created_at) FROM stdin;
    public               postgres    false    224            }          0    16703    update_attachments 
   TABLE DATA           x   COPY public.update_attachments (id, update_id, file_name, file_url, file_type, file_size_bytes, created_at) FROM stdin;
    public               postgres    false    228            {          0    16676    updates 
   TABLE DATA           ~   COPY public.updates (id, airtable_id, notes, date, update_type, project_id, task_id, update_owner_id, created_at) FROM stdin;
    public               postgres    false    226            s          0    16600    users 
   TABLE DATA           G   COPY public.users (id, airtable_id, user_name, created_at) FROM stdin;
    public               postgres    false    218            ï           0    0    accounts_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.accounts_id_seq', 1, false);
          public               postgres    false    219            î           0    0    projects_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.projects_id_seq', 1, false);
          public               postgres    false    221            ì           0    0    tasks_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.tasks_id_seq', 1, false);
          public               postgres    false    223            Ä           0    0    update_attachments_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.update_attachments_id_seq', 1, false);
          public               postgres    false    227            Å           0    0    updates_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.updates_id_seq', 1, true);
          public               postgres    false    225            É           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public               postgres    false    217            ╝           2606    16620 !   accounts accounts_airtable_id_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_airtable_id_key UNIQUE (airtable_id);
 K   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_airtable_id_key;
       public                 postgres    false    220            ╛           2606    16618    accounts accounts_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pkey;
       public                 postgres    false    220            ├           2606    16637 !   projects projects_airtable_id_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_airtable_id_key UNIQUE (airtable_id);
 K   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_airtable_id_key;
       public                 postgres    false    222            ┼           2606    16635    projects projects_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pkey;
       public                 postgres    false    222            ╩           2606    16659    tasks tasks_airtable_id_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_airtable_id_key UNIQUE (airtable_id);
 E   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_airtable_id_key;
       public                 postgres    false    224            ╠           2606    16657    tasks tasks_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public                 postgres    false    224            ╓           2606    16711 *   update_attachments update_attachments_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.update_attachments
    ADD CONSTRAINT update_attachments_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.update_attachments DROP CONSTRAINT update_attachments_pkey;
       public                 postgres    false    228            ╤           2606    16686    updates updates_airtable_id_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_airtable_id_key UNIQUE (airtable_id);
 I   ALTER TABLE ONLY public.updates DROP CONSTRAINT updates_airtable_id_key;
       public                 postgres    false    226            ╙           2606    16684    updates updates_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.updates DROP CONSTRAINT updates_pkey;
       public                 postgres    false    226            ╕           2606    16608    users users_airtable_id_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_airtable_id_key UNIQUE (airtable_id);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_airtable_id_key;
       public                 postgres    false    218            ║           2606    16606    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            ┐           1259    16717    idx_accounts_owner_id    INDEX     V   CREATE INDEX idx_accounts_owner_id ON public.accounts USING btree (account_owner_id);
 )   DROP INDEX public.idx_accounts_owner_id;
       public                 postgres    false    220            └           1259    16718    idx_projects_account_id    INDEX     R   CREATE INDEX idx_projects_account_id ON public.projects USING btree (account_id);
 +   DROP INDEX public.idx_projects_account_id;
       public                 postgres    false    222            ┴           1259    16719    idx_projects_owner_id    INDEX     V   CREATE INDEX idx_projects_owner_id ON public.projects USING btree (project_owner_id);
 )   DROP INDEX public.idx_projects_owner_id;
       public                 postgres    false    222            ╞           1259    16721    idx_tasks_assigned_to_id    INDEX     T   CREATE INDEX idx_tasks_assigned_to_id ON public.tasks USING btree (assigned_to_id);
 ,   DROP INDEX public.idx_tasks_assigned_to_id;
       public                 postgres    false    224            ╟           1259    16722    idx_tasks_created_by_id    INDEX     R   CREATE INDEX idx_tasks_created_by_id ON public.tasks USING btree (created_by_id);
 +   DROP INDEX public.idx_tasks_created_by_id;
       public                 postgres    false    224            ╚           1259    16720    idx_tasks_project_id    INDEX     L   CREATE INDEX idx_tasks_project_id ON public.tasks USING btree (project_id);
 (   DROP INDEX public.idx_tasks_project_id;
       public                 postgres    false    224            ╘           1259    16726     idx_update_attachments_update_id    INDEX     d   CREATE INDEX idx_update_attachments_update_id ON public.update_attachments USING btree (update_id);
 4   DROP INDEX public.idx_update_attachments_update_id;
       public                 postgres    false    228            ═           1259    16725    idx_updates_owner_id    INDEX     S   CREATE INDEX idx_updates_owner_id ON public.updates USING btree (update_owner_id);
 (   DROP INDEX public.idx_updates_owner_id;
       public                 postgres    false    226            ╬           1259    16723    idx_updates_project_id    INDEX     P   CREATE INDEX idx_updates_project_id ON public.updates USING btree (project_id);
 *   DROP INDEX public.idx_updates_project_id;
       public                 postgres    false    226            ╧           1259    16724    idx_updates_task_id    INDEX     J   CREATE INDEX idx_updates_task_id ON public.updates USING btree (task_id);
 '   DROP INDEX public.idx_updates_task_id;
       public                 postgres    false    226            ╫           2606    16621 '   accounts accounts_account_owner_id_fkey 
   FK CONSTRAINT     ó   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_account_owner_id_fkey FOREIGN KEY (account_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;
 Q   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_account_owner_id_fkey;
       public               postgres    false    220    4794    218            ╪           2606    16638 !   projects projects_account_id_fkey 
   FK CONSTRAINT     ÿ   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_account_id_fkey;
       public               postgres    false    4798    222    220            ┘           2606    16643 '   projects projects_project_owner_id_fkey 
   FK CONSTRAINT     ó   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_project_owner_id_fkey FOREIGN KEY (project_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;
 Q   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_project_owner_id_fkey;
       public               postgres    false    222    218    4794            ┌           2606    16665    tasks tasks_assigned_to_id_fkey 
   FK CONSTRAINT     ÿ   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_id_fkey FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON DELETE SET NULL;
 I   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_assigned_to_id_fkey;
       public               postgres    false    218    4794    224            █           2606    16670    tasks tasks_created_by_id_fkey 
   FK CONSTRAINT     û   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE RESTRICT;
 H   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_created_by_id_fkey;
       public               postgres    false    4794    218    224            ▄           2606    16660    tasks tasks_project_id_fkey 
   FK CONSTRAINT     Æ   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_project_id_fkey;
       public               postgres    false    222    4805    224            α           2606    16712 4   update_attachments update_attachments_update_id_fkey 
   FK CONSTRAINT     ⌐   ALTER TABLE ONLY public.update_attachments
    ADD CONSTRAINT update_attachments_update_id_fkey FOREIGN KEY (update_id) REFERENCES public.updates(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.update_attachments DROP CONSTRAINT update_attachments_update_id_fkey;
       public               postgres    false    4819    226    228            ▌           2606    16687    updates updates_project_id_fkey 
   FK CONSTRAINT     û   ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.updates DROP CONSTRAINT updates_project_id_fkey;
       public               postgres    false    4805    226    222            ▐           2606    16692    updates updates_task_id_fkey 
   FK CONSTRAINT     Ä   ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.updates DROP CONSTRAINT updates_task_id_fkey;
       public               postgres    false    226    224    4812            ▀           2606    16697 $   updates updates_update_owner_id_fkey 
   FK CONSTRAINT     ₧   ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_update_owner_id_fkey FOREIGN KEY (update_owner_id) REFERENCES public.users(id) ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public.updates DROP CONSTRAINT updates_update_owner_id_fkey;
       public               postgres    false    226    218    4794            u   P   x£3Σ,JMÄOLN╬/═+ë7Σt╠╦╠N-ßî±π4Σt╬╔L═│ìîLu
╠t
-═¡LL¡L
⌠,ìî╠M╡
L¡î
╕b⌠╕╕╕ A2╩      w   d   x£3Σ,JMÄ/(╩╧JM.ë7Σ⌠╠╦,╔L╠QNN╠IL╩IUÇHq╞°qréΣA"ΘE⌐┼┼ !2202╒50╙5┤T04╖21╡25╨│42207╒60╡26αè╤πΓΓ ∙a▌      y   o   x£3Σ,JMÄ/I,╬Ä7Σt╬╧-╚I-IUpI,ILJ,NU≡═L/J,╔╠╧πî±π⌠╠S(╩O/J-.µ4202╒50╫56α4CêÇÖ«íÑéí╣òë⌐ò⌐ü₧Ñææü╣⌐╢ü⌐ò▒Wî Yz≡      }   
   x£ï╤πΓΓ ┼ ⌐      {   W   x£3Σ,JMÄ╖03I▓0421457KσL╠H╠╩NKΣ4202╒50╙5┤ΣtN╠╔ß4Σî±aC+CC+C=C#smS+c«=... ╝eY      s   >   x£3Σ442615πt╠╦╠N-ß4202╒50╙5┤T04╖21╡25╨│42207╒60╡26αè╤πΓΓ ?A
ß     
