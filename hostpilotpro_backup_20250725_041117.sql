--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addon_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.addon_bookings (
    id integer NOT NULL,
    service_id integer NOT NULL,
    booking_id integer,
    property_id integer NOT NULL,
    guest_name character varying NOT NULL,
    guest_email character varying,
    guest_phone character varying,
    scheduled_date timestamp without time zone NOT NULL,
    duration integer,
    total_price numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    charged_to character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    quantity integer DEFAULT 1,
    base_price numeric(10,2),
    billing_type character varying NOT NULL,
    gift_reason text,
    booked_by character varying NOT NULL,
    booked_by_role character varying NOT NULL,
    approved_by character varying,
    approval_status character varying DEFAULT 'auto-approved'::character varying,
    internal_notes text
);


ALTER TABLE public.addon_bookings OWNER TO neondb_owner;

--
-- Name: addon_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.addon_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addon_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: addon_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.addon_bookings_id_seq OWNED BY public.addon_bookings.id;


--
-- Name: addon_services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.addon_services (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    category character varying NOT NULL,
    duration integer,
    is_active boolean DEFAULT true,
    available_properties integer[],
    max_advance_booking_days integer DEFAULT 30,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    pricing_model character varying DEFAULT 'fixed'::character varying NOT NULL,
    base_price numeric(10,2),
    hourly_rate numeric(10,2),
    minimum_charge numeric(10,2),
    requires_approval boolean DEFAULT false,
    allow_guest_booking boolean DEFAULT true,
    allow_manager_booking boolean DEFAULT true
);


ALTER TABLE public.addon_services OWNER TO neondb_owner;

--
-- Name: addon_services_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.addon_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addon_services_id_seq OWNER TO neondb_owner;

--
-- Name: addon_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.addon_services_id_seq OWNED BY public.addon_services.id;


--
-- Name: agent_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agent_bookings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    retail_agent_id character varying NOT NULL,
    property_id integer NOT NULL,
    booking_id integer,
    guest_name character varying NOT NULL,
    guest_email character varying NOT NULL,
    guest_phone character varying,
    check_in date NOT NULL,
    check_out date NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    commission_rate numeric(5,2) DEFAULT 10.00,
    commission_amount numeric(10,2) NOT NULL,
    booking_status character varying DEFAULT 'confirmed'::character varying,
    commission_status character varying DEFAULT 'pending'::character varying,
    hostaway_booking_id character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agent_bookings OWNER TO neondb_owner;

--
-- Name: agent_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agent_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: agent_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agent_bookings_id_seq OWNED BY public.agent_bookings.id;


--
-- Name: agent_media_access; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agent_media_access (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    agent_id character varying NOT NULL,
    media_file_id integer,
    folder_id integer,
    access_type character varying NOT NULL,
    access_reason character varying,
    ip_address character varying,
    user_agent text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agent_media_access OWNER TO neondb_owner;

--
-- Name: agent_media_access_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agent_media_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_media_access_id_seq OWNER TO neondb_owner;

--
-- Name: agent_media_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agent_media_access_id_seq OWNED BY public.agent_media_access.id;


--
-- Name: agent_payouts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.agent_payouts (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    agent_id character varying NOT NULL,
    agent_type character varying NOT NULL,
    payout_month character varying NOT NULL,
    total_earnings numeric(10,2) NOT NULL,
    payout_amount numeric(10,2) NOT NULL,
    payout_status character varying DEFAULT 'pending'::character varying,
    payout_method character varying,
    payment_reference character varying,
    receipt_url character varying,
    processed_by character varying,
    notes text,
    requested_at timestamp without time zone DEFAULT now(),
    approved_at timestamp without time zone,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agent_payouts OWNER TO neondb_owner;

--
-- Name: agent_payouts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.agent_payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_payouts_id_seq OWNER TO neondb_owner;

--
-- Name: agent_payouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.agent_payouts_id_seq OWNED BY public.agent_payouts.id;


--
-- Name: ai_configuration; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_configuration (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    auto_processing_enabled boolean DEFAULT true,
    ai_provider character varying DEFAULT 'keyword'::character varying,
    confidence_threshold numeric(3,2) DEFAULT 0.75,
    auto_task_creation boolean DEFAULT true,
    require_manager_approval boolean DEFAULT false,
    notification_settings jsonb,
    processing_cooldown integer DEFAULT 300,
    debug_mode boolean DEFAULT false,
    last_updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_configuration OWNER TO neondb_owner;

--
-- Name: ai_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_configuration_id_seq OWNER TO neondb_owner;

--
-- Name: ai_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_configuration_id_seq OWNED BY public.ai_configuration.id;


--
-- Name: ai_generated_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_generated_tasks (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    message_id integer,
    task_id integer,
    guest_id character varying NOT NULL,
    property_id integer NOT NULL,
    department character varying NOT NULL,
    task_type character varying NOT NULL,
    urgency character varying NOT NULL,
    ai_description text NOT NULL,
    ai_keywords text[] DEFAULT ARRAY[]::text[],
    confidence numeric(5,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    assigned_to character varying,
    approved_by character varying,
    approved_at timestamp without time zone,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_generated_tasks OWNER TO neondb_owner;

--
-- Name: ai_generated_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_generated_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_generated_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: ai_generated_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_generated_tasks_id_seq OWNED BY public.ai_generated_tasks.id;


--
-- Name: ai_media_suggestions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_media_suggestions (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    suggestion_type character varying NOT NULL,
    suggestion_text text NOT NULL,
    priority character varying DEFAULT 'medium'::character varying NOT NULL,
    confidence_score character varying,
    detected_issues character varying[],
    suggested_actions character varying[],
    trigger_source character varying,
    auto_actionable boolean DEFAULT false,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    reviewed_by character varying,
    review_date timestamp without time zone,
    review_notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_media_suggestions OWNER TO neondb_owner;

--
-- Name: ai_media_suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_media_suggestions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_media_suggestions_id_seq OWNER TO neondb_owner;

--
-- Name: ai_media_suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_media_suggestions_id_seq OWNED BY public.ai_media_suggestions.id;


--
-- Name: ai_task_rules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_task_rules (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    rule_name character varying NOT NULL,
    keywords jsonb NOT NULL,
    task_type character varying NOT NULL,
    task_title character varying NOT NULL,
    task_description text,
    assign_to_department character varying,
    default_assignee character varying,
    priority character varying DEFAULT 'medium'::character varying,
    auto_assign boolean DEFAULT true,
    is_active boolean DEFAULT true,
    trigger_count integer DEFAULT 0,
    last_triggered timestamp without time zone,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_task_rules OWNER TO neondb_owner;

--
-- Name: ai_task_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_task_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_task_rules_id_seq OWNER TO neondb_owner;

--
-- Name: ai_task_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_task_rules_id_seq OWNED BY public.ai_task_rules.id;


--
-- Name: booking_cost_breakdowns; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.booking_cost_breakdowns (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    booking_id integer NOT NULL,
    cost_type character varying NOT NULL,
    description character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying DEFAULT 'THB'::character varying,
    quantity integer DEFAULT 1,
    unit_price numeric(10,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.booking_cost_breakdowns OWNER TO neondb_owner;

--
-- Name: booking_cost_breakdowns_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.booking_cost_breakdowns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_cost_breakdowns_id_seq OWNER TO neondb_owner;

--
-- Name: booking_cost_breakdowns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.booking_cost_breakdowns_id_seq OWNED BY public.booking_cost_breakdowns.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    property_id integer,
    guest_name character varying NOT NULL,
    guest_email character varying,
    guest_phone character varying,
    check_in date NOT NULL,
    check_out date NOT NULL,
    guests integer NOT NULL,
    total_amount numeric(10,2),
    status character varying DEFAULT 'confirmed'::character varying NOT NULL,
    hostaway_id character varying,
    special_requests text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    external_id character varying,
    currency character varying DEFAULT 'AUD'::character varying,
    booking_reference character varying,
    guest_total_price numeric(10,2),
    platform_payout numeric(10,2),
    ota_commission_amount numeric(10,2),
    ota_commission_percentage numeric(5,2),
    booking_platform character varying DEFAULT 'direct'::character varying,
    stripe_fees numeric(10,2),
    net_host_payout numeric(10,2),
    manual_override boolean DEFAULT false,
    override_reason text,
    revenue_verified boolean DEFAULT false
);


ALTER TABLE public.bookings OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: commission_earnings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.commission_earnings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    user_id character varying NOT NULL,
    source_type character varying NOT NULL,
    source_id integer,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    commission_rate numeric(5,2) NOT NULL,
    base_amount numeric(10,2) NOT NULL,
    period character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    processed_by character varying,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.commission_earnings OWNER TO neondb_owner;

--
-- Name: commission_earnings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.commission_earnings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commission_earnings_id_seq OWNER TO neondb_owner;

--
-- Name: commission_earnings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.commission_earnings_id_seq OWNED BY public.commission_earnings.id;


--
-- Name: commission_invoice_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.commission_invoice_items (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    invoice_id integer NOT NULL,
    commission_log_id integer,
    description text NOT NULL,
    property_name character varying,
    reference_number character varying,
    commission_date character varying NOT NULL,
    commission_amount character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.commission_invoice_items OWNER TO neondb_owner;

--
-- Name: commission_invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.commission_invoice_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commission_invoice_items_id_seq OWNER TO neondb_owner;

--
-- Name: commission_invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.commission_invoice_items_id_seq OWNED BY public.commission_invoice_items.id;


--
-- Name: commission_invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.commission_invoices (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    agent_id character varying NOT NULL,
    agent_type character varying NOT NULL,
    invoice_number character varying NOT NULL,
    invoice_date character varying NOT NULL,
    period_start character varying NOT NULL,
    period_end character varying NOT NULL,
    total_commissions character varying NOT NULL,
    currency character varying DEFAULT 'THB'::character varying NOT NULL,
    description text,
    agent_notes text,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    submitted_at timestamp without time zone,
    approved_at timestamp without time zone,
    approved_by character varying,
    rejected_reason text,
    admin_notes text,
    generated_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    due_date character varying,
    CONSTRAINT commission_invoices_agent_type_check CHECK (((agent_type)::text = ANY ((ARRAY['retail-agent'::character varying, 'referral-agent'::character varying])::text[]))),
    CONSTRAINT commission_invoices_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'submitted'::character varying, 'approved'::character varying, 'rejected'::character varying, 'paid'::character varying])::text[])))
);


ALTER TABLE public.commission_invoices OWNER TO neondb_owner;

--
-- Name: commission_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.commission_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commission_invoices_id_seq OWNER TO neondb_owner;

--
-- Name: commission_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.commission_invoices_id_seq OWNED BY public.commission_invoices.id;


--
-- Name: commission_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.commission_log (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    agent_id character varying NOT NULL,
    agent_type character varying NOT NULL,
    property_id integer,
    booking_id integer,
    reference_number character varying,
    base_amount character varying NOT NULL,
    commission_rate character varying NOT NULL,
    commission_amount character varying NOT NULL,
    currency character varying DEFAULT 'THB'::character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    is_adjustment boolean DEFAULT false,
    original_commission_id integer,
    adjustment_reason text,
    processed_by character varying,
    processed_at timestamp without time zone,
    admin_notes text,
    commission_month integer,
    commission_year integer,
    payout_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT commission_log_agent_type_check CHECK (((agent_type)::text = ANY ((ARRAY['retail-agent'::character varying, 'referral-agent'::character varying])::text[]))),
    CONSTRAINT commission_log_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.commission_log OWNER TO neondb_owner;

--
-- Name: commission_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.commission_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commission_log_id_seq OWNER TO neondb_owner;

--
-- Name: commission_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.commission_log_id_seq OWNED BY public.commission_log.id;


--
-- Name: custom_expense_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.custom_expense_categories (
    id integer NOT NULL,
    organization_id character varying(255) NOT NULL,
    category_name character varying(255) NOT NULL,
    description text,
    billing_cycle character varying(50) DEFAULT 'monthly'::character varying,
    default_amount character varying(50),
    currency character varying(10) DEFAULT 'THB'::character varying,
    display_order integer DEFAULT 1,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_recurring boolean DEFAULT true,
    auto_reminder boolean DEFAULT true,
    reminder_days integer DEFAULT 5,
    is_active boolean DEFAULT true
);


ALTER TABLE public.custom_expense_categories OWNER TO neondb_owner;

--
-- Name: custom_expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.custom_expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_expense_categories_id_seq OWNER TO neondb_owner;

--
-- Name: custom_expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.custom_expense_categories_id_seq OWNED BY public.custom_expense_categories.id;


--
-- Name: feedback_processing_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feedback_processing_log (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    feedback_id integer NOT NULL,
    processing_type character varying NOT NULL,
    triggered_rule_id integer,
    matched_keywords jsonb,
    confidence_score numeric(3,2),
    action_taken character varying NOT NULL,
    created_task_id integer,
    processed_by character varying,
    ai_model character varying,
    processing_time integer,
    error_message text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.feedback_processing_log OWNER TO neondb_owner;

--
-- Name: feedback_processing_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.feedback_processing_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_processing_log_id_seq OWNER TO neondb_owner;

--
-- Name: feedback_processing_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.feedback_processing_log_id_seq OWNED BY public.feedback_processing_log.id;


--
-- Name: finances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.finances (
    id integer NOT NULL,
    property_id integer,
    booking_id integer,
    type character varying NOT NULL,
    category character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    date date NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    subcategory character varying,
    due_date date,
    is_recurring boolean DEFAULT false,
    recurring_type character varying,
    next_due_date date,
    owner_id character varying,
    agent_id character varying,
    commission_rate numeric(5,2),
    source character varying NOT NULL,
    source_type character varying,
    processed_by character varying,
    reference_number character varying,
    attachment_url character varying
);


ALTER TABLE public.finances OWNER TO neondb_owner;

--
-- Name: finances_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.finances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finances_id_seq OWNER TO neondb_owner;

--
-- Name: finances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.finances_id_seq OWNED BY public.finances.id;


--
-- Name: financial_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.financial_transactions (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    transaction_type character varying NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'AUD'::character varying,
    from_party character varying,
    to_party character varying,
    reference_type character varying,
    reference_id integer,
    booking_reference character varying,
    source_platform character varying,
    platform_booking_id character varying,
    description text NOT NULL,
    category character varying,
    status character varying DEFAULT 'pending'::character varying,
    processed_by character varying,
    processed_at timestamp without time zone,
    receipt_url character varying,
    invoice_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.financial_transactions OWNER TO neondb_owner;

--
-- Name: financial_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.financial_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_transactions_id_seq OWNER TO neondb_owner;

--
-- Name: financial_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.financial_transactions_id_seq OWNED BY public.financial_transactions.id;


--
-- Name: guest_activity_timeline; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_activity_timeline (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_session_id integer NOT NULL,
    booking_id integer,
    activity_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    status character varying DEFAULT 'pending'::character varying,
    requested_at timestamp without time zone NOT NULL,
    confirmed_at timestamp without time zone,
    completed_at timestamp without time zone,
    estimated_cost numeric(10,2),
    actual_cost numeric(10,2),
    charge_assignment character varying DEFAULT 'guest'::character varying,
    is_visible boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_activity_timeline OWNER TO neondb_owner;

--
-- Name: guest_activity_timeline_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_activity_timeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_activity_timeline_id_seq OWNER TO neondb_owner;

--
-- Name: guest_activity_timeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_activity_timeline_id_seq OWNED BY public.guest_activity_timeline.id;


--
-- Name: guest_addon_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_addon_bookings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    service_id integer NOT NULL,
    property_id integer NOT NULL,
    guest_name character varying NOT NULL,
    guest_email character varying NOT NULL,
    guest_phone character varying,
    booking_date timestamp without time zone DEFAULT now(),
    service_date timestamp without time zone NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    total_amount character varying NOT NULL,
    currency character varying DEFAULT 'AUD'::character varying,
    billing_route character varying NOT NULL,
    complimentary_type character varying,
    payment_status character varying DEFAULT 'pending'::character varying,
    payment_method character varying,
    stripe_payment_intent_id character varying,
    special_requests text,
    internal_notes text,
    assigned_task_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    booked_by character varying,
    confirmed_by character varying,
    cancelled_by character varying,
    cancellation_reason text
);


ALTER TABLE public.guest_addon_bookings OWNER TO neondb_owner;

--
-- Name: guest_addon_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_addon_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_addon_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: guest_addon_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_addon_bookings_id_seq OWNED BY public.guest_addon_bookings.id;


--
-- Name: guest_addon_service_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_addon_service_requests (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_session_id integer NOT NULL,
    booking_id integer,
    service_id integer,
    service_name character varying NOT NULL,
    service_type character varying NOT NULL,
    requested_date date NOT NULL,
    requested_time character varying,
    duration integer,
    guest_count integer DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1,
    total_cost numeric(10,2) NOT NULL,
    charge_assignment character varying DEFAULT 'guest'::character varying,
    assignment_reason text,
    special_requests text,
    guest_notes text,
    request_status character varying DEFAULT 'pending'::character varying,
    confirmed_by character varying,
    confirmed_at timestamp without time zone,
    completed_at timestamp without time zone,
    completion_notes text,
    guest_rating integer,
    guest_review text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_addon_service_requests OWNER TO neondb_owner;

--
-- Name: guest_addon_service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_addon_service_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_addon_service_requests_id_seq OWNER TO neondb_owner;

--
-- Name: guest_addon_service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_addon_service_requests_id_seq OWNED BY public.guest_addon_service_requests.id;


--
-- Name: guest_addon_services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_addon_services (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    service_name character varying NOT NULL,
    description text,
    category character varying NOT NULL,
    pricing_type character varying NOT NULL,
    base_price character varying NOT NULL,
    currency character varying DEFAULT 'AUD'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    requires_time_slot boolean DEFAULT false,
    max_advance_booking_days integer DEFAULT 30,
    cancellation_policy_hours integer DEFAULT 24,
    auto_create_task boolean DEFAULT true,
    task_type character varying,
    task_priority character varying DEFAULT 'medium'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by character varying
);


ALTER TABLE public.guest_addon_services OWNER TO neondb_owner;

--
-- Name: guest_addon_services_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_addon_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_addon_services_id_seq OWNER TO neondb_owner;

--
-- Name: guest_addon_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_addon_services_id_seq OWNED BY public.guest_addon_services.id;


--
-- Name: guest_ai_faq_knowledge; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_ai_faq_knowledge (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer,
    question_keyword character varying NOT NULL,
    response_text text NOT NULL,
    category character varying DEFAULT 'general'::character varying,
    priority integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_ai_faq_knowledge OWNER TO neondb_owner;

--
-- Name: guest_ai_faq_knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_ai_faq_knowledge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_ai_faq_knowledge_id_seq OWNER TO neondb_owner;

--
-- Name: guest_ai_faq_knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_ai_faq_knowledge_id_seq OWNED BY public.guest_ai_faq_knowledge.id;


--
-- Name: guest_chat_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_chat_messages (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_session_id integer NOT NULL,
    booking_id integer,
    message_type character varying NOT NULL,
    sender_type character varying NOT NULL,
    message_content text NOT NULL,
    message_thread_id character varying,
    ai_processed boolean DEFAULT false,
    detected_issue character varying,
    issue_severity character varying,
    requires_staff_response boolean DEFAULT false,
    sent_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_chat_messages OWNER TO neondb_owner;

--
-- Name: guest_chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_chat_messages_id_seq OWNER TO neondb_owner;

--
-- Name: guest_chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_chat_messages_id_seq OWNED BY public.guest_chat_messages.id;


--
-- Name: guest_feedback; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_feedback (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    booking_id integer,
    property_id integer,
    guest_name character varying NOT NULL,
    guest_email character varying,
    feedback_type character varying NOT NULL,
    feedback_channel character varying DEFAULT 'portal'::character varying,
    original_message text NOT NULL,
    detected_keywords jsonb,
    sentiment_score numeric(3,2),
    urgency_level character varying DEFAULT 'medium'::character varying,
    is_processed boolean DEFAULT false,
    requires_action boolean DEFAULT false,
    assigned_task_id integer,
    processed_by character varying,
    processing_notes text,
    received_at timestamp without time zone DEFAULT now(),
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_feedback OWNER TO neondb_owner;

--
-- Name: guest_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_feedback_id_seq OWNER TO neondb_owner;

--
-- Name: guest_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_feedback_id_seq OWNED BY public.guest_feedback.id;


--
-- Name: guest_maintenance_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_maintenance_reports (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_session_id integer NOT NULL,
    booking_id integer,
    property_id integer NOT NULL,
    issue_type character varying NOT NULL,
    issue_title character varying NOT NULL,
    issue_description text NOT NULL,
    location_in_property character varying NOT NULL,
    severity_level character varying DEFAULT 'medium'::character varying,
    report_images text[],
    report_videos text[],
    report_status character varying DEFAULT 'pending'::character varying,
    assigned_to character varying,
    assigned_at timestamp without time zone,
    estimated_resolution_time timestamp without time zone,
    actual_resolution_time timestamp without time zone,
    resolution_notes text,
    resolution_images text[],
    reported_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_maintenance_reports OWNER TO neondb_owner;

--
-- Name: guest_maintenance_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_maintenance_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_maintenance_reports_id_seq OWNER TO neondb_owner;

--
-- Name: guest_maintenance_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_maintenance_reports_id_seq OWNED BY public.guest_maintenance_reports.id;


--
-- Name: guest_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_messages (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_id character varying NOT NULL,
    guest_name character varying NOT NULL,
    guest_email character varying,
    booking_id integer,
    property_id integer,
    message_content text NOT NULL,
    message_type character varying NOT NULL,
    priority character varying DEFAULT 'normal'::character varying,
    status character varying DEFAULT 'new'::character varying,
    ai_processed boolean DEFAULT false,
    ai_keywords text[] DEFAULT ARRAY[]::text[],
    ai_sentiment character varying,
    ai_confidence numeric(5,2),
    ai_suggestions text[] DEFAULT ARRAY[]::text[],
    staff_response text,
    responded_by character varying,
    responded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_messages OWNER TO neondb_owner;

--
-- Name: guest_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_messages_id_seq OWNER TO neondb_owner;

--
-- Name: guest_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_messages_id_seq OWNED BY public.guest_messages.id;


--
-- Name: guest_portal_access; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_portal_access (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    guest_email character varying NOT NULL,
    access_token character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    booking_reference character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    guest_name character varying,
    check_in_date timestamp without time zone,
    check_out_date timestamp without time zone,
    created_by character varying,
    last_accessed_at timestamp without time zone
);


ALTER TABLE public.guest_portal_access OWNER TO neondb_owner;

--
-- Name: guest_portal_access_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_portal_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_portal_access_id_seq OWNER TO neondb_owner;

--
-- Name: guest_portal_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_portal_access_id_seq OWNED BY public.guest_portal_access.id;


--
-- Name: guest_portal_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_portal_sessions (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    booking_id integer,
    guest_email character varying NOT NULL,
    access_token character varying NOT NULL,
    property_id integer,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    guest_name character varying,
    guest_phone character varying,
    is_active boolean DEFAULT true,
    expires_at timestamp without time zone NOT NULL,
    last_accessed timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_portal_sessions OWNER TO neondb_owner;

--
-- Name: guest_portal_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_portal_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_portal_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: guest_portal_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_portal_sessions_id_seq OWNED BY public.guest_portal_sessions.id;


--
-- Name: guest_property_local_info; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_property_local_info (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    location_type character varying NOT NULL,
    location_name character varying NOT NULL,
    description text,
    location_address text,
    distance_from_property numeric(5,2),
    estimated_cost numeric(10,2),
    recommendation_score integer,
    operating_hours character varying,
    contact_info character varying,
    booking_url character varying,
    display_order integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_property_local_info OWNER TO neondb_owner;

--
-- Name: guest_property_local_info_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_property_local_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_property_local_info_id_seq OWNER TO neondb_owner;

--
-- Name: guest_property_local_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_property_local_info_id_seq OWNED BY public.guest_property_local_info.id;


--
-- Name: guest_service_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guest_service_requests (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    guest_id character varying NOT NULL,
    guest_name character varying NOT NULL,
    booking_id integer,
    property_id integer NOT NULL,
    service_type character varying NOT NULL,
    service_name character varying NOT NULL,
    requested_date timestamp without time zone,
    requested_time character varying,
    number_of_guests integer DEFAULT 1,
    special_requests text,
    estimated_cost numeric(10,2),
    currency character varying DEFAULT 'AUD'::character varying,
    payment_method character varying,
    status character varying DEFAULT 'pending'::character varying,
    confirmed_by character varying,
    confirmed_at timestamp without time zone,
    completed_at timestamp without time zone,
    guest_rating integer,
    guest_feedback text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_service_requests OWNER TO neondb_owner;

--
-- Name: guest_service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guest_service_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_service_requests_id_seq OWNER TO neondb_owner;

--
-- Name: guest_service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guest_service_requests_id_seq OWNED BY public.guest_service_requests.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    property_id integer,
    item_name character varying NOT NULL,
    category character varying NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    min_quantity integer DEFAULT 0,
    unit_cost numeric(10,2),
    supplier character varying,
    last_restocked timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    usage_tracking boolean DEFAULT false
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: invoice_line_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoice_line_items (
    id integer NOT NULL,
    invoice_id integer,
    description text NOT NULL,
    quantity numeric(10,2) DEFAULT '1'::numeric,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    reference_id character varying,
    reference_type character varying
);


ALTER TABLE public.invoice_line_items OWNER TO neondb_owner;

--
-- Name: invoice_line_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invoice_line_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_line_items_id_seq OWNER TO neondb_owner;

--
-- Name: invoice_line_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invoice_line_items_id_seq OWNED BY public.invoice_line_items.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    invoice_number character varying NOT NULL,
    sender_type character varying NOT NULL,
    sender_id character varying,
    sender_name character varying NOT NULL,
    sender_address text,
    receiver_type character varying NOT NULL,
    receiver_id character varying,
    receiver_name character varying NOT NULL,
    receiver_address text,
    invoice_type character varying NOT NULL,
    description text NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_rate numeric(5,2) DEFAULT '0'::numeric,
    tax_amount numeric(10,2) DEFAULT '0'::numeric,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    status character varying DEFAULT 'draft'::character varying,
    due_date date,
    paid_date date,
    reference_number character varying,
    notes text,
    attachments jsonb,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invoices OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: maintenance_approval_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_approval_logs (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    suggestion_id integer NOT NULL,
    action character varying NOT NULL,
    action_by character varying NOT NULL,
    action_reason text,
    previous_status character varying,
    new_status character varying,
    approval_notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.maintenance_approval_logs OWNER TO neondb_owner;

--
-- Name: maintenance_approval_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_approval_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_approval_logs_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_approval_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_approval_logs_id_seq OWNED BY public.maintenance_approval_logs.id;


--
-- Name: maintenance_suggestion_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_suggestion_settings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_approval_required boolean DEFAULT true,
    auto_approve_under_amount numeric(10,2) DEFAULT 100.00,
    approval_timeout_days integer DEFAULT 7,
    require_multiple_quotes boolean DEFAULT false,
    multiple_quotes_threshold numeric(10,2) DEFAULT 500.00,
    require_photos boolean DEFAULT true,
    require_detailed_description boolean DEFAULT true,
    max_attachment_size integer DEFAULT 10485760,
    allowed_file_types text[] DEFAULT ARRAY['jpg'::text, 'jpeg'::text, 'png'::text, 'pdf'::text, 'doc'::text, 'docx'::text],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.maintenance_suggestion_settings OWNER TO neondb_owner;

--
-- Name: maintenance_suggestion_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_suggestion_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_suggestion_settings_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_suggestion_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_suggestion_settings_id_seq OWNED BY public.maintenance_suggestion_settings.id;


--
-- Name: maintenance_suggestions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_suggestions (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    title character varying NOT NULL,
    maintenance_type character varying NOT NULL,
    description text NOT NULL,
    estimated_cost numeric(10,2),
    is_urgent boolean DEFAULT false,
    photos text[] DEFAULT ARRAY[]::text[],
    status character varying DEFAULT 'pending'::character varying,
    approval_status character varying DEFAULT 'pending'::character varying,
    owner_comments text,
    suggested_by character varying NOT NULL,
    approved_by character varying,
    payment_responsibility character varying DEFAULT 'owner'::character varying,
    external_contractor_required boolean DEFAULT false,
    preferred_contractor_id integer,
    completion_deadline date,
    approval_deadline date,
    task_created_id integer,
    finance_entry_id integer,
    timeline_entry_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    urgency_level character varying DEFAULT 'normal'::character varying,
    currency character varying DEFAULT 'AUD'::character varying,
    cost_breakdown jsonb,
    who_pays_cost character varying DEFAULT 'owner'::character varying,
    attachments text[] DEFAULT ARRAY[]::text[],
    evidence_photos text[] DEFAULT ARRAY[]::text[],
    supporting_documents text[] DEFAULT ARRAY[]::text[],
    submitted_by_role character varying,
    submission_reason text,
    owner_response character varying,
    owner_response_notes text,
    owner_responded_at timestamp without time zone,
    external_contractor_info jsonb,
    task_created_at timestamp without time zone,
    finance_recorded_at timestamp without time zone,
    system_notes text,
    visible_to_owner boolean DEFAULT true,
    notification_sent_at timestamp without time zone,
    reminder_count integer DEFAULT 0,
    submitted_by character varying
);


ALTER TABLE public.maintenance_suggestions OWNER TO neondb_owner;

--
-- Name: maintenance_suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_suggestions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_suggestions_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_suggestions_id_seq OWNED BY public.maintenance_suggestions.id;


--
-- Name: maintenance_timeline_entries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_timeline_entries (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    suggestion_id integer NOT NULL,
    entry_type character varying NOT NULL,
    entry_title character varying NOT NULL,
    entry_description text,
    entry_icon character varying DEFAULT 'wrench'::character varying,
    visible_to_owner boolean DEFAULT true,
    visible_to_staff boolean DEFAULT true,
    visible_to_guests boolean DEFAULT false,
    created_by character varying NOT NULL,
    affects_users text[] DEFAULT ARRAY[]::text[],
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.maintenance_timeline_entries OWNER TO neondb_owner;

--
-- Name: maintenance_timeline_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_timeline_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_timeline_entries_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_timeline_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_timeline_entries_id_seq OWNED BY public.maintenance_timeline_entries.id;


--
-- Name: marketplace_service_analytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketplace_service_analytics (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    service_id integer NOT NULL,
    property_id integer,
    period_start date NOT NULL,
    period_end date NOT NULL,
    total_bookings integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0,
    most_requested_time character varying,
    peak_season_months text[],
    customer_satisfaction_score numeric(3,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.marketplace_service_analytics OWNER TO neondb_owner;

--
-- Name: marketplace_service_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marketplace_service_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_service_analytics_id_seq OWNER TO neondb_owner;

--
-- Name: marketplace_service_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marketplace_service_analytics_id_seq OWNED BY public.marketplace_service_analytics.id;


--
-- Name: marketplace_services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketplace_services (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    vendor_id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    short_description text,
    photos text[],
    pricing_type character varying NOT NULL,
    base_price numeric(10,2),
    currency character varying DEFAULT 'THB'::character varying,
    price_notes text,
    requires_approval boolean DEFAULT false,
    requires_pre_payment boolean DEFAULT false,
    cancellation_policy text,
    duration character varying,
    availability character varying,
    booking_instructions text,
    special_notes text,
    tags text[],
    is_active boolean DEFAULT true,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.marketplace_services OWNER TO neondb_owner;

--
-- Name: marketplace_services_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marketplace_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_services_id_seq OWNER TO neondb_owner;

--
-- Name: marketplace_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marketplace_services_id_seq OWNED BY public.marketplace_services.id;


--
-- Name: media_folders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.media_folders (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    folder_name character varying NOT NULL,
    folder_description text,
    cloud_folder_link character varying,
    cloud_provider character varying DEFAULT 'google_drive'::character varying NOT NULL,
    access_level character varying DEFAULT 'private'::character varying NOT NULL,
    is_agent_approved boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.media_folders OWNER TO neondb_owner;

--
-- Name: media_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.media_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_folders_id_seq OWNER TO neondb_owner;

--
-- Name: media_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.media_folders_id_seq OWNED BY public.media_folders.id;


--
-- Name: media_usage_analytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.media_usage_analytics (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    media_file_id integer NOT NULL,
    view_count integer DEFAULT 0,
    download_count integer DEFAULT 0,
    share_count integer DEFAULT 0,
    weekly_views integer DEFAULT 0,
    monthly_views integer DEFAULT 0,
    popularity_score character varying,
    last_accessed timestamp without time zone,
    trending_score integer DEFAULT 0,
    reset_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.media_usage_analytics OWNER TO neondb_owner;

--
-- Name: media_usage_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.media_usage_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_usage_analytics_id_seq OWNER TO neondb_owner;

--
-- Name: media_usage_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.media_usage_analytics_id_seq OWNED BY public.media_usage_analytics.id;


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_preferences (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    user_id character varying NOT NULL,
    enable_in_app boolean DEFAULT true,
    enable_email boolean DEFAULT true,
    enable_sms boolean DEFAULT false,
    enable_whatsapp boolean DEFAULT false,
    enable_line boolean DEFAULT false,
    task_assignments boolean DEFAULT true,
    booking_updates boolean DEFAULT true,
    payout_actions boolean DEFAULT true,
    maintenance_approvals boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notification_preferences OWNER TO neondb_owner;

--
-- Name: notification_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notification_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_preferences_id_seq OWNER TO neondb_owner;

--
-- Name: notification_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notification_preferences_id_seq OWNED BY public.notification_preferences.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    user_id character varying NOT NULL,
    type character varying NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    related_entity_type character varying,
    related_entity_id integer,
    priority character varying DEFAULT 'normal'::character varying,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    action_url character varying,
    action_label character varying,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: onboarding_step_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.onboarding_step_details (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    onboarding_id integer NOT NULL,
    step_number integer NOT NULL,
    step_name character varying NOT NULL,
    step_description text,
    is_completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    completed_by character varying,
    step_data jsonb,
    validation_errors text[],
    attempt_count integer DEFAULT 0,
    last_attempt_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.onboarding_step_details OWNER TO neondb_owner;

--
-- Name: onboarding_step_details_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.onboarding_step_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.onboarding_step_details_id_seq OWNER TO neondb_owner;

--
-- Name: onboarding_step_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.onboarding_step_details_id_seq OWNED BY public.onboarding_step_details.id;


--
-- Name: organization_api_keys; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organization_api_keys (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    provider character varying NOT NULL,
    key_name character varying NOT NULL,
    encrypted_value text NOT NULL,
    description character varying,
    is_active boolean DEFAULT true,
    last_used timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.organization_api_keys OWNER TO neondb_owner;

--
-- Name: organization_api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.organization_api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organization_api_keys_id_seq OWNER TO neondb_owner;

--
-- Name: organization_api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.organization_api_keys_id_seq OWNED BY public.organization_api_keys.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organizations (
    id character varying NOT NULL,
    name character varying NOT NULL,
    domain character varying NOT NULL,
    subdomain character varying NOT NULL,
    company_logo character varying,
    settings jsonb,
    subscription_tier character varying DEFAULT 'basic'::character varying,
    max_users integer DEFAULT 10,
    max_properties integer DEFAULT 50,
    is_active boolean DEFAULT true,
    trial_ends_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.organizations OWNER TO neondb_owner;

--
-- Name: owner_activity_timeline; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_activity_timeline (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    owner_id character varying NOT NULL,
    activity_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    metadata jsonb,
    reference_id integer,
    reference_type character varying,
    created_at timestamp without time zone DEFAULT now(),
    created_by character varying
);


ALTER TABLE public.owner_activity_timeline OWNER TO neondb_owner;

--
-- Name: owner_activity_timeline_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_activity_timeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_activity_timeline_id_seq OWNER TO neondb_owner;

--
-- Name: owner_activity_timeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_activity_timeline_id_seq OWNED BY public.owner_activity_timeline.id;


--
-- Name: owner_balances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_balances (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    current_balance numeric(12,2) DEFAULT 0,
    total_earnings numeric(12,2) DEFAULT 0,
    total_expenses numeric(12,2) DEFAULT 0,
    total_payouts_requested numeric(12,2) DEFAULT 0,
    total_payouts_paid numeric(12,2) DEFAULT 0,
    this_month_earnings numeric(12,2) DEFAULT 0,
    this_month_expenses numeric(12,2) DEFAULT 0,
    this_month_net numeric(12,2) DEFAULT 0,
    last_calculated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.owner_balances OWNER TO neondb_owner;

--
-- Name: owner_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_balances_id_seq OWNER TO neondb_owner;

--
-- Name: owner_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_balances_id_seq OWNED BY public.owner_balances.id;


--
-- Name: owner_charge_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_charge_requests (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    charged_by character varying NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'AUD'::character varying,
    reason text NOT NULL,
    description text,
    due_date date,
    payment_method character varying,
    payment_reference character varying,
    payment_receipt_url character varying,
    status character varying DEFAULT 'pending'::character varying,
    charged_at timestamp without time zone DEFAULT now(),
    paid_at timestamp without time zone,
    processed_by character varying
);


ALTER TABLE public.owner_charge_requests OWNER TO neondb_owner;

--
-- Name: owner_charge_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_charge_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_charge_requests_id_seq OWNER TO neondb_owner;

--
-- Name: owner_charge_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_charge_requests_id_seq OWNED BY public.owner_charge_requests.id;


--
-- Name: owner_documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_documents (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    process_id integer,
    owner_id character varying NOT NULL,
    property_id integer,
    category character varying NOT NULL,
    file_name character varying NOT NULL,
    original_file_name character varying,
    file_type character varying,
    file_path character varying,
    title character varying NOT NULL,
    description text,
    file_url character varying NOT NULL,
    file_size integer,
    mime_type character varying,
    has_expiration boolean DEFAULT false,
    expiration_date timestamp without time zone,
    expiration_alert_sent boolean DEFAULT false,
    status character varying DEFAULT 'pending'::character varying,
    uploaded_by character varying NOT NULL,
    reviewed_by character varying,
    reviewed_at timestamp without time zone,
    review_comments text,
    is_public boolean DEFAULT false,
    visibility character varying DEFAULT 'private'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT owner_documents_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'expired'::character varying])::text[])))
);


ALTER TABLE public.owner_documents OWNER TO neondb_owner;

--
-- Name: owner_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_documents_id_seq OWNER TO neondb_owner;

--
-- Name: owner_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_documents_id_seq OWNED BY public.owner_documents.id;


--
-- Name: owner_financial_summary; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_financial_summary (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    property_id integer,
    period_start date NOT NULL,
    period_end date NOT NULL,
    rental_income numeric(12,2) DEFAULT 0,
    addon_revenue numeric(12,2) DEFAULT 0,
    management_fees numeric(12,2) DEFAULT 0,
    utility_deductions numeric(12,2) DEFAULT 0,
    service_deductions numeric(12,2) DEFAULT 0,
    net_balance numeric(12,2) DEFAULT 0,
    breakdown jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.owner_financial_summary OWNER TO neondb_owner;

--
-- Name: owner_financial_summary_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_financial_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_financial_summary_id_seq OWNER TO neondb_owner;

--
-- Name: owner_financial_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_financial_summary_id_seq OWNED BY public.owner_financial_summary.id;


--
-- Name: owner_invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_invoices (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    property_id integer,
    invoice_number character varying NOT NULL,
    invoice_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    currency character varying DEFAULT 'AUD'::character varying,
    period_start date,
    period_end date,
    due_date date,
    status character varying DEFAULT 'pending'::character varying,
    pdf_url character varying,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    created_by character varying,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.owner_invoices OWNER TO neondb_owner;

--
-- Name: owner_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_invoices_id_seq OWNER TO neondb_owner;

--
-- Name: owner_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_invoices_id_seq OWNED BY public.owner_invoices.id;


--
-- Name: owner_onboarding_processes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_onboarding_processes (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    property_id integer,
    step1_owner_contact_info boolean DEFAULT false,
    step2_property_basics boolean DEFAULT false,
    step3_location_mapping boolean DEFAULT false,
    step4_photo_uploads boolean DEFAULT false,
    step5_property_description boolean DEFAULT false,
    step6_utility_info boolean DEFAULT false,
    step7_legal_documents boolean DEFAULT false,
    step8_security_access boolean DEFAULT false,
    step9_services_setup boolean DEFAULT false,
    total_steps integer DEFAULT 9,
    completed_steps integer DEFAULT 0,
    progress_percentage numeric(5,2) DEFAULT 0.00,
    current_step integer DEFAULT 1,
    onboarding_deadline timestamp without time zone,
    deadline_set_by character varying,
    priority character varying DEFAULT 'medium'::character varying,
    estimated_days_remaining integer,
    is_overdue boolean DEFAULT false,
    admin_notes text,
    owner_instructions text,
    next_step_instructions text,
    last_activity_at timestamp without time zone,
    last_updated_by character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT owner_onboarding_processes_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[])))
);


ALTER TABLE public.owner_onboarding_processes OWNER TO neondb_owner;

--
-- Name: owner_onboarding_processes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_onboarding_processes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_onboarding_processes_id_seq OWNER TO neondb_owner;

--
-- Name: owner_onboarding_processes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_onboarding_processes_id_seq OWNED BY public.owner_onboarding_processes.id;


--
-- Name: owner_payout_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_payout_requests (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying DEFAULT 'AUD'::character varying,
    period_start date NOT NULL,
    period_end date NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    request_notes text,
    admin_notes text,
    payment_receipt_url character varying,
    payment_method character varying,
    payment_reference character varying,
    requested_at timestamp without time zone DEFAULT now(),
    approved_at timestamp without time zone,
    approved_by character varying,
    payment_uploaded_at timestamp without time zone,
    payment_uploaded_by character varying,
    completed_at timestamp without time zone,
    completed_by character varying
);


ALTER TABLE public.owner_payout_requests OWNER TO neondb_owner;

--
-- Name: owner_payout_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_payout_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_payout_requests_id_seq OWNER TO neondb_owner;

--
-- Name: owner_payout_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_payout_requests_id_seq OWNED BY public.owner_payout_requests.id;


--
-- Name: owner_payouts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_payouts (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    property_id integer,
    requested_amount character varying NOT NULL,
    currency character varying DEFAULT 'USD'::character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    request_date timestamp without time zone DEFAULT now(),
    requested_by character varying NOT NULL,
    request_notes text,
    approved_by character varying,
    approved_date timestamp without time zone,
    approval_notes text,
    payment_method character varying,
    payment_reference character varying,
    payment_date timestamp without time zone,
    paid_by character varying,
    receipt_url character varying,
    receipt_uploaded_by character varying,
    receipt_uploaded_date timestamp without time zone,
    confirmed_by character varying,
    confirmed_date timestamp without time zone,
    period_start_date character varying,
    period_end_date character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.owner_payouts OWNER TO neondb_owner;

--
-- Name: owner_payouts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_payouts_id_seq OWNER TO neondb_owner;

--
-- Name: owner_payouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_payouts_id_seq OWNED BY public.owner_payouts.id;


--
-- Name: owner_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_preferences (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    task_approval_required boolean DEFAULT false,
    maintenance_alerts boolean DEFAULT true,
    guest_addon_notifications boolean DEFAULT true,
    financial_notifications boolean DEFAULT true,
    weekly_reports boolean DEFAULT true,
    preferred_currency character varying DEFAULT 'AUD'::character varying,
    notification_email character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.owner_preferences OWNER TO neondb_owner;

--
-- Name: owner_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_preferences_id_seq OWNER TO neondb_owner;

--
-- Name: owner_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_preferences_id_seq OWNED BY public.owner_preferences.id;


--
-- Name: owner_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_settings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    task_approval_required boolean DEFAULT false,
    maintenance_alerts boolean DEFAULT true,
    guest_addon_notifications boolean DEFAULT true,
    financial_notifications boolean DEFAULT true,
    weekly_reports boolean DEFAULT true,
    preferred_currency character varying(3) DEFAULT 'AUD'::character varying,
    notification_email character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.owner_settings OWNER TO neondb_owner;

--
-- Name: owner_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_settings_id_seq OWNER TO neondb_owner;

--
-- Name: owner_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_settings_id_seq OWNED BY public.owner_settings.id;


--
-- Name: owner_timeline_activity; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.owner_timeline_activity (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    owner_id character varying NOT NULL,
    property_id integer,
    activity_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    property_name character varying(255),
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.owner_timeline_activity OWNER TO neondb_owner;

--
-- Name: owner_timeline_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.owner_timeline_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_timeline_activity_id_seq OWNER TO neondb_owner;

--
-- Name: owner_timeline_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.owner_timeline_activity_id_seq OWNED BY public.owner_timeline_activity.id;


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.platform_settings (
    id integer NOT NULL,
    setting_key character varying NOT NULL,
    setting_value text,
    setting_type character varying NOT NULL,
    category character varying NOT NULL,
    description text,
    is_secret boolean DEFAULT false,
    updated_by character varying,
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.platform_settings OWNER TO neondb_owner;

--
-- Name: platform_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.platform_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platform_settings_id_seq OWNER TO neondb_owner;

--
-- Name: platform_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.platform_settings_id_seq OWNED BY public.platform_settings.id;


--
-- Name: pm_commission_balance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pm_commission_balance (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    total_earned numeric(10,2) DEFAULT 0,
    total_paid numeric(10,2) DEFAULT 0,
    current_balance numeric(10,2) DEFAULT 0,
    last_payout_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pm_commission_balance OWNER TO neondb_owner;

--
-- Name: pm_commission_balance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pm_commission_balance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pm_commission_balance_id_seq OWNER TO neondb_owner;

--
-- Name: pm_commission_balance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pm_commission_balance_id_seq OWNED BY public.pm_commission_balance.id;


--
-- Name: pm_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pm_notifications (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    type character varying NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    severity character varying DEFAULT 'info'::character varying,
    action_required boolean DEFAULT false,
    is_read boolean DEFAULT false,
    related_type character varying,
    related_id character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pm_notifications OWNER TO neondb_owner;

--
-- Name: pm_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pm_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pm_notifications_id_seq OWNER TO neondb_owner;

--
-- Name: pm_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pm_notifications_id_seq OWNED BY public.pm_notifications.id;


--
-- Name: pm_payout_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pm_payout_requests (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'AUD'::character varying,
    request_notes text,
    admin_notes text,
    status character varying DEFAULT 'pending'::character varying,
    receipt_url character varying,
    requested_at timestamp without time zone DEFAULT now(),
    approved_at timestamp without time zone,
    approved_by character varying,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    processed_by character varying
);


ALTER TABLE public.pm_payout_requests OWNER TO neondb_owner;

--
-- Name: pm_payout_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pm_payout_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pm_payout_requests_id_seq OWNER TO neondb_owner;

--
-- Name: pm_payout_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pm_payout_requests_id_seq OWNED BY public.pm_payout_requests.id;


--
-- Name: pm_property_performance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pm_property_performance (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    property_id integer NOT NULL,
    period character varying NOT NULL,
    revenue numeric(10,2) DEFAULT 0,
    expenses numeric(10,2) DEFAULT 0,
    net_income numeric(10,2) DEFAULT 0,
    commission_earned numeric(10,2) DEFAULT 0,
    occupancy_rate numeric(5,2) DEFAULT 0,
    booking_count integer DEFAULT 0,
    avg_rating numeric(3,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pm_property_performance OWNER TO neondb_owner;

--
-- Name: pm_property_performance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pm_property_performance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pm_property_performance_id_seq OWNER TO neondb_owner;

--
-- Name: pm_property_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pm_property_performance_id_seq OWNED BY public.pm_property_performance.id;


--
-- Name: pm_task_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pm_task_logs (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    property_id integer,
    task_title character varying NOT NULL,
    department character varying,
    staff_assigned character varying,
    status character varying NOT NULL,
    result text,
    notes text,
    evidence_photos text[],
    receipts text[],
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pm_task_logs OWNER TO neondb_owner;

--
-- Name: pm_task_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pm_task_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pm_task_logs_id_seq OWNER TO neondb_owner;

--
-- Name: pm_task_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pm_task_logs_id_seq OWNED BY public.pm_task_logs.id;


--
-- Name: portfolio_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.portfolio_assignments (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    manager_id character varying NOT NULL,
    property_id integer,
    commission_rate numeric(5,2) DEFAULT '50'::numeric,
    assigned_at timestamp without time zone DEFAULT now(),
    unassigned_at timestamp without time zone,
    is_active boolean DEFAULT true
);


ALTER TABLE public.portfolio_assignments OWNER TO neondb_owner;

--
-- Name: portfolio_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.portfolio_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: portfolio_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.portfolio_assignments_id_seq OWNED BY public.portfolio_assignments.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    name character varying NOT NULL,
    address text NOT NULL,
    description text,
    bedrooms integer,
    bathrooms integer,
    max_guests integer,
    price_per_night numeric(10,2),
    status character varying DEFAULT 'active'::character varying NOT NULL,
    amenities text[],
    images text[],
    hostaway_id character varying,
    owner_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    external_id character varying,
    currency character varying DEFAULT 'AUD'::character varying,
    google_maps_link text
);


ALTER TABLE public.properties OWNER TO neondb_owner;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO neondb_owner;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: property_agents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_agents (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    agent_id character varying NOT NULL,
    agent_type character varying NOT NULL,
    assigned_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_agents OWNER TO neondb_owner;

--
-- Name: property_agents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_agents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_agents_id_seq OWNER TO neondb_owner;

--
-- Name: property_agents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_agents_id_seq OWNED BY public.property_agents.id;


--
-- Name: property_custom_expenses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_custom_expenses (
    id integer NOT NULL,
    organization_id character varying(255) NOT NULL,
    property_id integer NOT NULL,
    category_id integer,
    amount character varying(50),
    billing_cycle character varying(50) DEFAULT 'monthly'::character varying,
    next_due_date date,
    is_active boolean DEFAULT true,
    notes text,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_custom_expenses OWNER TO neondb_owner;

--
-- Name: property_custom_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_custom_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_custom_expenses_id_seq OWNER TO neondb_owner;

--
-- Name: property_custom_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_custom_expenses_id_seq OWNED BY public.property_custom_expenses.id;


--
-- Name: property_media_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_media_files (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    file_name character varying NOT NULL,
    media_type character varying NOT NULL,
    description text,
    cloud_link character varying NOT NULL,
    cloud_provider character varying DEFAULT 'google_drive'::character varying NOT NULL,
    thumbnail_url character varying,
    access_level character varying DEFAULT 'private'::character varying NOT NULL,
    tags text[],
    is_agent_approved boolean DEFAULT false,
    is_unbranded boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    uploaded_by character varying NOT NULL,
    approved_by character varying,
    approval_date timestamp without time zone,
    file_size_bytes bigint,
    capture_location character varying,
    captured_date timestamp without time zone,
    last_updated_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_media_files OWNER TO neondb_owner;

--
-- Name: property_media_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_media_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_media_files_id_seq OWNER TO neondb_owner;

--
-- Name: property_media_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_media_files_id_seq OWNED BY public.property_media_files.id;


--
-- Name: property_media_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_media_settings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    auto_approval_enabled boolean DEFAULT false,
    agent_upload_enabled boolean DEFAULT false,
    watermark_enabled boolean DEFAULT false,
    watermark_template character varying,
    quality_requirements jsonb,
    approval_workflow jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_media_settings OWNER TO neondb_owner;

--
-- Name: property_media_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_media_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_media_settings_id_seq OWNER TO neondb_owner;

--
-- Name: property_media_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_media_settings_id_seq OWNED BY public.property_media_settings.id;


--
-- Name: property_payout_rules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_payout_rules (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer,
    airbnb_owner_percent numeric(5,2) DEFAULT 70,
    airbnb_management_percent numeric(5,2) DEFAULT 30,
    vrbo_owner_percent numeric(5,2) DEFAULT 0,
    vrbo_management_percent numeric(5,2) DEFAULT 100,
    booking_owner_percent numeric(5,2) DEFAULT 0,
    booking_management_percent numeric(5,2) DEFAULT 100,
    direct_owner_percent numeric(5,2) DEFAULT 0,
    direct_management_percent numeric(5,2) DEFAULT 100,
    stripe_fee_percent numeric(5,2) DEFAULT 5,
    stripe_fee_note text DEFAULT '5% processing fee applied'::text,
    allow_booking_override boolean DEFAULT true,
    default_currency character varying(3) DEFAULT 'AUD'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_payout_rules OWNER TO neondb_owner;

--
-- Name: property_payout_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_payout_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_payout_rules_id_seq OWNER TO neondb_owner;

--
-- Name: property_payout_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_payout_rules_id_seq OWNED BY public.property_payout_rules.id;


--
-- Name: property_referrals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_referrals (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    referral_agent_id character varying NOT NULL,
    referral_date timestamp without time zone DEFAULT now(),
    commission_rate numeric(5,2) DEFAULT 10.00,
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_referrals OWNER TO neondb_owner;

--
-- Name: property_referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_referrals_id_seq OWNER TO neondb_owner;

--
-- Name: property_referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_referrals_id_seq OWNED BY public.property_referrals.id;


--
-- Name: property_revenue_targets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_revenue_targets (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    target_year integer NOT NULL,
    target_quarter integer,
    target_amount numeric(12,2) NOT NULL,
    currency character varying DEFAULT 'THB'::character varying NOT NULL,
    current_revenue numeric(12,2) DEFAULT 0,
    description text,
    is_active boolean DEFAULT true,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_revenue_targets OWNER TO neondb_owner;

--
-- Name: property_revenue_targets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_revenue_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_revenue_targets_id_seq OWNER TO neondb_owner;

--
-- Name: property_revenue_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_revenue_targets_id_seq OWNED BY public.property_revenue_targets.id;


--
-- Name: property_utility_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_utility_accounts (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    utility_type character varying NOT NULL,
    provider character varying NOT NULL,
    account_number character varying NOT NULL,
    package_info text,
    expected_bill_day integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_utility_accounts OWNER TO neondb_owner;

--
-- Name: property_utility_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_utility_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_utility_accounts_id_seq OWNER TO neondb_owner;

--
-- Name: property_utility_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_utility_accounts_id_seq OWNED BY public.property_utility_accounts.id;


--
-- Name: property_utility_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.property_utility_settings (
    id integer NOT NULL,
    organization_id character varying(255) NOT NULL,
    property_id integer NOT NULL,
    utility_type character varying(50) NOT NULL,
    provider_id integer,
    account_number character varying(255),
    account_holder character varying(255),
    is_active boolean DEFAULT true,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.property_utility_settings OWNER TO neondb_owner;

--
-- Name: property_utility_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.property_utility_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_utility_settings_id_seq OWNER TO neondb_owner;

--
-- Name: property_utility_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.property_utility_settings_id_seq OWNED BY public.property_utility_settings.id;


--
-- Name: recurring_service_charges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.recurring_service_charges (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer,
    service_name character varying NOT NULL,
    service_category character varying NOT NULL,
    provider_name character varying,
    provider_contact character varying,
    monthly_rate numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'THB'::character varying,
    billing_day integer DEFAULT 1,
    charge_assignment character varying DEFAULT 'owner'::character varying,
    auto_deduct boolean DEFAULT true,
    requires_approval boolean DEFAULT false,
    service_frequency character varying DEFAULT 'weekly'::character varying,
    service_day character varying,
    service_time character varying,
    is_active boolean DEFAULT true,
    start_date date NOT NULL,
    end_date date,
    last_charged_date date,
    next_charge_date date,
    notes text,
    contract_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.recurring_service_charges OWNER TO neondb_owner;

--
-- Name: recurring_service_charges_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.recurring_service_charges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recurring_service_charges_id_seq OWNER TO neondb_owner;

--
-- Name: recurring_service_charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.recurring_service_charges_id_seq OWNED BY public.recurring_service_charges.id;


--
-- Name: referral_earnings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.referral_earnings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    referral_agent_id character varying NOT NULL,
    property_id integer NOT NULL,
    earnings_month character varying NOT NULL,
    management_fee numeric(10,2) NOT NULL,
    commission_rate numeric(5,2) DEFAULT 10.00,
    commission_amount numeric(10,2) NOT NULL,
    occupancy_rate numeric(5,2),
    average_review_score numeric(3,1),
    total_bookings integer DEFAULT 0,
    is_confirmed boolean DEFAULT false,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.referral_earnings OWNER TO neondb_owner;

--
-- Name: referral_earnings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.referral_earnings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referral_earnings_id_seq OWNER TO neondb_owner;

--
-- Name: referral_earnings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.referral_earnings_id_seq OWNED BY public.referral_earnings.id;


--
-- Name: service_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_bookings (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    service_id integer NOT NULL,
    property_id integer NOT NULL,
    booking_number character varying NOT NULL,
    guest_name character varying NOT NULL,
    guest_email character varying,
    guest_phone character varying,
    guest_notes text,
    requested_date date,
    requested_time character varying,
    estimated_duration integer,
    total_amount numeric(10,2),
    currency character varying DEFAULT 'THB'::character varying,
    billing_assignment character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    payment_status character varying DEFAULT 'pending'::character varying,
    requested_by character varying NOT NULL,
    requested_by_role character varying NOT NULL,
    approved_by character varying,
    approved_at timestamp without time zone,
    rejected_by character varying,
    rejected_at timestamp without time zone,
    rejection_reason text,
    confirmed_by character varying,
    confirmed_at timestamp without time zone,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    completion_notes text,
    cancelled_at timestamp without time zone,
    cancellation_reason text,
    internal_notes text,
    vendor_notes text,
    access_instructions text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.service_bookings OWNER TO neondb_owner;

--
-- Name: service_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: service_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_bookings_id_seq OWNED BY public.service_bookings.id;


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_categories (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    icon character varying,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    color character varying DEFAULT '#6B7280'::character varying
);


ALTER TABLE public.service_categories OWNER TO neondb_owner;

--
-- Name: service_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_categories_id_seq OWNER TO neondb_owner;

--
-- Name: service_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;


--
-- Name: service_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_reviews (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    service_id integer NOT NULL,
    booking_id integer NOT NULL,
    vendor_id integer NOT NULL,
    rating integer NOT NULL,
    title character varying,
    review text,
    reviewer_type character varying NOT NULL,
    reviewer_name character varying,
    is_anonymous boolean DEFAULT false,
    quality_rating integer,
    timeliness_rating integer,
    value_rating integer,
    communication_rating integer,
    is_approved boolean DEFAULT true,
    is_public boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.service_reviews OWNER TO neondb_owner;

--
-- Name: service_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_reviews_id_seq OWNER TO neondb_owner;

--
-- Name: service_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_reviews_id_seq OWNED BY public.service_reviews.id;


--
-- Name: service_vendor_analytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_vendor_analytics (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    vendor_id integer NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    total_bookings integer DEFAULT 0,
    completed_bookings integer DEFAULT 0,
    cancelled_bookings integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0,
    response_time_hours numeric(5,2) DEFAULT 0,
    completion_rate numeric(5,2) DEFAULT 0,
    repeat_customer_rate numeric(5,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.service_vendor_analytics OWNER TO neondb_owner;

--
-- Name: service_vendor_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_vendor_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_vendor_analytics_id_seq OWNER TO neondb_owner;

--
-- Name: service_vendor_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_vendor_analytics_id_seq OWNED BY public.service_vendor_analytics.id;


--
-- Name: service_vendors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_vendors (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    logo character varying,
    vendor_type character varying DEFAULT 'external'::character varying NOT NULL,
    contact_person character varying,
    phone character varying,
    email character varying,
    address text,
    website character varying,
    business_license character varying,
    tax_id character varying,
    bank_details text,
    rating numeric(3,2) DEFAULT 5.00,
    review_count integer DEFAULT 0,
    response_time_hours integer DEFAULT 24,
    commission_rate numeric(5,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    available_days text[],
    working_hours jsonb,
    payment_terms character varying DEFAULT 'net_30'::character varying,
    delivery_time character varying,
    service_area text,
    specializations text[],
    certifications text[],
    tags text[],
    notes text,
    created_by character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    preferred_payment_method character varying DEFAULT 'bank_transfer'::character varying
);


ALTER TABLE public.service_vendors OWNER TO neondb_owner;

--
-- Name: service_vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_vendors_id_seq OWNER TO neondb_owner;

--
-- Name: service_vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_vendors_id_seq OWNED BY public.service_vendors.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL,
    organization_id character varying
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: staff_salaries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.staff_salaries (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    user_id character varying NOT NULL,
    monthly_salary numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    bonus_structure jsonb,
    commission_rate numeric(5,2) DEFAULT '0'::numeric,
    is_active boolean DEFAULT true,
    effective_from date NOT NULL,
    effective_to date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.staff_salaries OWNER TO neondb_owner;

--
-- Name: staff_salaries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.staff_salaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_salaries_id_seq OWNER TO neondb_owner;

--
-- Name: staff_salaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.staff_salaries_id_seq OWNED BY public.staff_salaries.id;


--
-- Name: task_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.task_history (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    task_id integer NOT NULL,
    property_id integer,
    action character varying NOT NULL,
    previous_status character varying,
    new_status character varying,
    performed_by character varying,
    notes text,
    evidence_photos text[] DEFAULT '{}'::text[],
    issues_found text[] DEFAULT '{}'::text[],
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.task_history OWNER TO neondb_owner;

--
-- Name: task_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.task_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_history_id_seq OWNER TO neondb_owner;

--
-- Name: task_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.task_history_id_seq OWNED BY public.task_history.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    type character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    priority character varying DEFAULT 'medium'::character varying NOT NULL,
    property_id integer,
    assigned_to character varying,
    created_by character varying,
    due_date timestamp without time zone,
    completed_at timestamp without time zone,
    estimated_cost numeric(10,2),
    actual_cost numeric(10,2),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    department character varying,
    is_recurring boolean DEFAULT false,
    recurring_type character varying,
    recurring_interval integer DEFAULT 1,
    next_due_date timestamp without time zone,
    parent_task_id integer,
    organization_id character varying NOT NULL,
    completion_notes text,
    evidence_photos text[] DEFAULT '{}'::text[],
    issues_found text[] DEFAULT '{}'::text[],
    skip_reason text,
    reschedule_reason text,
    rescheduled_date timestamp without time zone
);


ALTER TABLE public.tasks OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO neondb_owner;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'guest'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    is_active boolean DEFAULT true,
    last_login_at timestamp without time zone,
    password text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: utility_bill_reminders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.utility_bill_reminders (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    utility_bill_id integer,
    reminder_type character varying NOT NULL,
    sent_at timestamp without time zone DEFAULT now(),
    sent_to character varying NOT NULL,
    reminder_message text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.utility_bill_reminders OWNER TO neondb_owner;

--
-- Name: utility_bill_reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.utility_bill_reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utility_bill_reminders_id_seq OWNER TO neondb_owner;

--
-- Name: utility_bill_reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.utility_bill_reminders_id_seq OWNED BY public.utility_bill_reminders.id;


--
-- Name: utility_bills; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.utility_bills (
    id integer NOT NULL,
    property_id integer NOT NULL,
    type character varying NOT NULL,
    provider character varying,
    account_number character varying,
    amount numeric(10,2),
    due_date date NOT NULL,
    bill_period_start date,
    bill_period_end date,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    receipt_url character varying,
    reminder_sent boolean DEFAULT false,
    is_recurring boolean DEFAULT true,
    next_due_date date,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    organization_id character varying NOT NULL,
    utility_account_id integer,
    currency character varying DEFAULT 'AUD'::character varying,
    billing_month character varying NOT NULL,
    receipt_filename character varying,
    responsible_party character varying DEFAULT 'owner'::character varying NOT NULL,
    is_owner_billable boolean DEFAULT true,
    uploaded_by character varying,
    uploaded_at timestamp without time zone,
    notes text
);


ALTER TABLE public.utility_bills OWNER TO neondb_owner;

--
-- Name: utility_bills_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.utility_bills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utility_bills_id_seq OWNER TO neondb_owner;

--
-- Name: utility_bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.utility_bills_id_seq OWNED BY public.utility_bills.id;


--
-- Name: utility_providers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.utility_providers (
    id integer NOT NULL,
    organization_id character varying(255) NOT NULL,
    utility_type character varying(50) NOT NULL,
    provider_name character varying(255) NOT NULL,
    country character varying(100) NOT NULL,
    is_default boolean DEFAULT false,
    display_order integer DEFAULT 1,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    region character varying,
    is_active boolean DEFAULT true,
    contact_info text,
    billing_cycle character varying DEFAULT 'monthly'::character varying,
    notes text
);


ALTER TABLE public.utility_providers OWNER TO neondb_owner;

--
-- Name: utility_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.utility_providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utility_providers_id_seq OWNER TO neondb_owner;

--
-- Name: utility_providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.utility_providers_id_seq OWNED BY public.utility_providers.id;


--
-- Name: vendor_service_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vendor_service_history (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    vendor_id integer NOT NULL,
    service_id integer NOT NULL,
    property_id integer NOT NULL,
    completed_date date NOT NULL,
    quality_score integer,
    timeliness_score integer,
    cost numeric(10,2),
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vendor_service_history OWNER TO neondb_owner;

--
-- Name: vendor_service_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.vendor_service_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_service_history_id_seq OWNER TO neondb_owner;

--
-- Name: vendor_service_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.vendor_service_history_id_seq OWNED BY public.vendor_service_history.id;


--
-- Name: welcome_pack_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welcome_pack_items (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    name character varying NOT NULL,
    category character varying NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    currency character varying DEFAULT 'AUD'::character varying,
    supplier character varying,
    restock_threshold integer DEFAULT 10,
    current_stock integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.welcome_pack_items OWNER TO neondb_owner;

--
-- Name: welcome_pack_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welcome_pack_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welcome_pack_items_id_seq OWNER TO neondb_owner;

--
-- Name: welcome_pack_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welcome_pack_items_id_seq OWNED BY public.welcome_pack_items.id;


--
-- Name: welcome_pack_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welcome_pack_templates (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    item_id integer NOT NULL,
    default_quantity integer NOT NULL,
    is_complimentary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.welcome_pack_templates OWNER TO neondb_owner;

--
-- Name: welcome_pack_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welcome_pack_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welcome_pack_templates_id_seq OWNER TO neondb_owner;

--
-- Name: welcome_pack_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welcome_pack_templates_id_seq OWNED BY public.welcome_pack_templates.id;


--
-- Name: welcome_pack_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welcome_pack_usage (
    id integer NOT NULL,
    organization_id character varying NOT NULL,
    property_id integer NOT NULL,
    booking_id integer,
    item_id integer NOT NULL,
    quantity_used integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    total_cost numeric(10,2) NOT NULL,
    billing_option character varying DEFAULT 'owner_bill'::character varying NOT NULL,
    processed_by character varying,
    usage_date date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.welcome_pack_usage OWNER TO neondb_owner;

--
-- Name: welcome_pack_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welcome_pack_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welcome_pack_usage_id_seq OWNER TO neondb_owner;

--
-- Name: welcome_pack_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welcome_pack_usage_id_seq OWNED BY public.welcome_pack_usage.id;


--
-- Name: addon_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings ALTER COLUMN id SET DEFAULT nextval('public.addon_bookings_id_seq'::regclass);


--
-- Name: addon_services id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_services ALTER COLUMN id SET DEFAULT nextval('public.addon_services_id_seq'::regclass);


--
-- Name: agent_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings ALTER COLUMN id SET DEFAULT nextval('public.agent_bookings_id_seq'::regclass);


--
-- Name: agent_media_access id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_media_access ALTER COLUMN id SET DEFAULT nextval('public.agent_media_access_id_seq'::regclass);


--
-- Name: agent_payouts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_payouts ALTER COLUMN id SET DEFAULT nextval('public.agent_payouts_id_seq'::regclass);


--
-- Name: ai_configuration id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_configuration ALTER COLUMN id SET DEFAULT nextval('public.ai_configuration_id_seq'::regclass);


--
-- Name: ai_generated_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_generated_tasks ALTER COLUMN id SET DEFAULT nextval('public.ai_generated_tasks_id_seq'::regclass);


--
-- Name: ai_media_suggestions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_media_suggestions ALTER COLUMN id SET DEFAULT nextval('public.ai_media_suggestions_id_seq'::regclass);


--
-- Name: ai_task_rules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_task_rules ALTER COLUMN id SET DEFAULT nextval('public.ai_task_rules_id_seq'::regclass);


--
-- Name: booking_cost_breakdowns id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.booking_cost_breakdowns ALTER COLUMN id SET DEFAULT nextval('public.booking_cost_breakdowns_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: commission_earnings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_earnings ALTER COLUMN id SET DEFAULT nextval('public.commission_earnings_id_seq'::regclass);


--
-- Name: commission_invoice_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoice_items ALTER COLUMN id SET DEFAULT nextval('public.commission_invoice_items_id_seq'::regclass);


--
-- Name: commission_invoices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoices ALTER COLUMN id SET DEFAULT nextval('public.commission_invoices_id_seq'::regclass);


--
-- Name: commission_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_log ALTER COLUMN id SET DEFAULT nextval('public.commission_log_id_seq'::regclass);


--
-- Name: custom_expense_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_expense_categories ALTER COLUMN id SET DEFAULT nextval('public.custom_expense_categories_id_seq'::regclass);


--
-- Name: feedback_processing_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log ALTER COLUMN id SET DEFAULT nextval('public.feedback_processing_log_id_seq'::regclass);


--
-- Name: finances id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances ALTER COLUMN id SET DEFAULT nextval('public.finances_id_seq'::regclass);


--
-- Name: financial_transactions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_transactions ALTER COLUMN id SET DEFAULT nextval('public.financial_transactions_id_seq'::regclass);


--
-- Name: guest_activity_timeline id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_activity_timeline ALTER COLUMN id SET DEFAULT nextval('public.guest_activity_timeline_id_seq'::regclass);


--
-- Name: guest_addon_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_bookings ALTER COLUMN id SET DEFAULT nextval('public.guest_addon_bookings_id_seq'::regclass);


--
-- Name: guest_addon_service_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_service_requests ALTER COLUMN id SET DEFAULT nextval('public.guest_addon_service_requests_id_seq'::regclass);


--
-- Name: guest_addon_services id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_services ALTER COLUMN id SET DEFAULT nextval('public.guest_addon_services_id_seq'::regclass);


--
-- Name: guest_ai_faq_knowledge id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_ai_faq_knowledge ALTER COLUMN id SET DEFAULT nextval('public.guest_ai_faq_knowledge_id_seq'::regclass);


--
-- Name: guest_chat_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_chat_messages ALTER COLUMN id SET DEFAULT nextval('public.guest_chat_messages_id_seq'::regclass);


--
-- Name: guest_feedback id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_feedback ALTER COLUMN id SET DEFAULT nextval('public.guest_feedback_id_seq'::regclass);


--
-- Name: guest_maintenance_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_maintenance_reports ALTER COLUMN id SET DEFAULT nextval('public.guest_maintenance_reports_id_seq'::regclass);


--
-- Name: guest_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_messages ALTER COLUMN id SET DEFAULT nextval('public.guest_messages_id_seq'::regclass);


--
-- Name: guest_portal_access id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_access ALTER COLUMN id SET DEFAULT nextval('public.guest_portal_access_id_seq'::regclass);


--
-- Name: guest_portal_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_sessions ALTER COLUMN id SET DEFAULT nextval('public.guest_portal_sessions_id_seq'::regclass);


--
-- Name: guest_property_local_info id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_property_local_info ALTER COLUMN id SET DEFAULT nextval('public.guest_property_local_info_id_seq'::regclass);


--
-- Name: guest_service_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_service_requests ALTER COLUMN id SET DEFAULT nextval('public.guest_service_requests_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: invoice_line_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoice_line_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_line_items_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: maintenance_approval_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_approval_logs ALTER COLUMN id SET DEFAULT nextval('public.maintenance_approval_logs_id_seq'::regclass);


--
-- Name: maintenance_suggestion_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_suggestion_settings ALTER COLUMN id SET DEFAULT nextval('public.maintenance_suggestion_settings_id_seq'::regclass);


--
-- Name: maintenance_suggestions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_suggestions ALTER COLUMN id SET DEFAULT nextval('public.maintenance_suggestions_id_seq'::regclass);


--
-- Name: maintenance_timeline_entries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_timeline_entries ALTER COLUMN id SET DEFAULT nextval('public.maintenance_timeline_entries_id_seq'::regclass);


--
-- Name: marketplace_service_analytics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_service_analytics ALTER COLUMN id SET DEFAULT nextval('public.marketplace_service_analytics_id_seq'::regclass);


--
-- Name: marketplace_services id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_services ALTER COLUMN id SET DEFAULT nextval('public.marketplace_services_id_seq'::regclass);


--
-- Name: media_folders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.media_folders ALTER COLUMN id SET DEFAULT nextval('public.media_folders_id_seq'::regclass);


--
-- Name: media_usage_analytics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.media_usage_analytics ALTER COLUMN id SET DEFAULT nextval('public.media_usage_analytics_id_seq'::regclass);


--
-- Name: notification_preferences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_preferences ALTER COLUMN id SET DEFAULT nextval('public.notification_preferences_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: onboarding_step_details id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_step_details ALTER COLUMN id SET DEFAULT nextval('public.onboarding_step_details_id_seq'::regclass);


--
-- Name: organization_api_keys id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_api_keys ALTER COLUMN id SET DEFAULT nextval('public.organization_api_keys_id_seq'::regclass);


--
-- Name: owner_activity_timeline id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline ALTER COLUMN id SET DEFAULT nextval('public.owner_activity_timeline_id_seq'::regclass);


--
-- Name: owner_balances id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_balances ALTER COLUMN id SET DEFAULT nextval('public.owner_balances_id_seq'::regclass);


--
-- Name: owner_charge_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_charge_requests ALTER COLUMN id SET DEFAULT nextval('public.owner_charge_requests_id_seq'::regclass);


--
-- Name: owner_documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents ALTER COLUMN id SET DEFAULT nextval('public.owner_documents_id_seq'::regclass);


--
-- Name: owner_financial_summary id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_financial_summary ALTER COLUMN id SET DEFAULT nextval('public.owner_financial_summary_id_seq'::regclass);


--
-- Name: owner_invoices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices ALTER COLUMN id SET DEFAULT nextval('public.owner_invoices_id_seq'::regclass);


--
-- Name: owner_onboarding_processes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes ALTER COLUMN id SET DEFAULT nextval('public.owner_onboarding_processes_id_seq'::regclass);


--
-- Name: owner_payout_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests ALTER COLUMN id SET DEFAULT nextval('public.owner_payout_requests_id_seq'::regclass);


--
-- Name: owner_payouts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payouts ALTER COLUMN id SET DEFAULT nextval('public.owner_payouts_id_seq'::regclass);


--
-- Name: owner_preferences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_preferences ALTER COLUMN id SET DEFAULT nextval('public.owner_preferences_id_seq'::regclass);


--
-- Name: owner_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_settings ALTER COLUMN id SET DEFAULT nextval('public.owner_settings_id_seq'::regclass);


--
-- Name: owner_timeline_activity id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_timeline_activity ALTER COLUMN id SET DEFAULT nextval('public.owner_timeline_activity_id_seq'::regclass);


--
-- Name: platform_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_settings ALTER COLUMN id SET DEFAULT nextval('public.platform_settings_id_seq'::regclass);


--
-- Name: pm_commission_balance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_commission_balance ALTER COLUMN id SET DEFAULT nextval('public.pm_commission_balance_id_seq'::regclass);


--
-- Name: pm_notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_notifications ALTER COLUMN id SET DEFAULT nextval('public.pm_notifications_id_seq'::regclass);


--
-- Name: pm_payout_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_payout_requests ALTER COLUMN id SET DEFAULT nextval('public.pm_payout_requests_id_seq'::regclass);


--
-- Name: pm_property_performance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_property_performance ALTER COLUMN id SET DEFAULT nextval('public.pm_property_performance_id_seq'::regclass);


--
-- Name: pm_task_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_task_logs ALTER COLUMN id SET DEFAULT nextval('public.pm_task_logs_id_seq'::regclass);


--
-- Name: portfolio_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_assignments ALTER COLUMN id SET DEFAULT nextval('public.portfolio_assignments_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: property_agents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_agents ALTER COLUMN id SET DEFAULT nextval('public.property_agents_id_seq'::regclass);


--
-- Name: property_custom_expenses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_custom_expenses ALTER COLUMN id SET DEFAULT nextval('public.property_custom_expenses_id_seq'::regclass);


--
-- Name: property_media_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_media_files ALTER COLUMN id SET DEFAULT nextval('public.property_media_files_id_seq'::regclass);


--
-- Name: property_media_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_media_settings ALTER COLUMN id SET DEFAULT nextval('public.property_media_settings_id_seq'::regclass);


--
-- Name: property_payout_rules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_payout_rules ALTER COLUMN id SET DEFAULT nextval('public.property_payout_rules_id_seq'::regclass);


--
-- Name: property_referrals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_referrals ALTER COLUMN id SET DEFAULT nextval('public.property_referrals_id_seq'::regclass);


--
-- Name: property_revenue_targets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_revenue_targets ALTER COLUMN id SET DEFAULT nextval('public.property_revenue_targets_id_seq'::regclass);


--
-- Name: property_utility_accounts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_accounts ALTER COLUMN id SET DEFAULT nextval('public.property_utility_accounts_id_seq'::regclass);


--
-- Name: property_utility_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_settings ALTER COLUMN id SET DEFAULT nextval('public.property_utility_settings_id_seq'::regclass);


--
-- Name: recurring_service_charges id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recurring_service_charges ALTER COLUMN id SET DEFAULT nextval('public.recurring_service_charges_id_seq'::regclass);


--
-- Name: referral_earnings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referral_earnings ALTER COLUMN id SET DEFAULT nextval('public.referral_earnings_id_seq'::regclass);


--
-- Name: service_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings ALTER COLUMN id SET DEFAULT nextval('public.service_bookings_id_seq'::regclass);


--
-- Name: service_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);


--
-- Name: service_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews ALTER COLUMN id SET DEFAULT nextval('public.service_reviews_id_seq'::regclass);


--
-- Name: service_vendor_analytics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendor_analytics ALTER COLUMN id SET DEFAULT nextval('public.service_vendor_analytics_id_seq'::regclass);


--
-- Name: service_vendors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendors ALTER COLUMN id SET DEFAULT nextval('public.service_vendors_id_seq'::regclass);


--
-- Name: staff_salaries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.staff_salaries ALTER COLUMN id SET DEFAULT nextval('public.staff_salaries_id_seq'::regclass);


--
-- Name: task_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history ALTER COLUMN id SET DEFAULT nextval('public.task_history_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: utility_bill_reminders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bill_reminders ALTER COLUMN id SET DEFAULT nextval('public.utility_bill_reminders_id_seq'::regclass);


--
-- Name: utility_bills id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bills ALTER COLUMN id SET DEFAULT nextval('public.utility_bills_id_seq'::regclass);


--
-- Name: utility_providers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_providers ALTER COLUMN id SET DEFAULT nextval('public.utility_providers_id_seq'::regclass);


--
-- Name: vendor_service_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history ALTER COLUMN id SET DEFAULT nextval('public.vendor_service_history_id_seq'::regclass);


--
-- Name: welcome_pack_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_items ALTER COLUMN id SET DEFAULT nextval('public.welcome_pack_items_id_seq'::regclass);


--
-- Name: welcome_pack_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_templates ALTER COLUMN id SET DEFAULT nextval('public.welcome_pack_templates_id_seq'::regclass);


--
-- Name: welcome_pack_usage id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_usage ALTER COLUMN id SET DEFAULT nextval('public.welcome_pack_usage_id_seq'::regclass);


--
-- Data for Name: addon_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.addon_bookings (id, service_id, booking_id, property_id, guest_name, guest_email, guest_phone, scheduled_date, duration, total_price, status, charged_to, notes, created_at, updated_at, organization_id, quantity, base_price, billing_type, gift_reason, booked_by, booked_by_role, approved_by, approval_status, internal_notes) FROM stdin;
\.


--
-- Data for Name: addon_services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.addon_services (id, name, description, category, duration, is_active, available_properties, max_advance_booking_days, created_at, updated_at, organization_id, pricing_model, base_price, hourly_rate, minimum_charge, requires_approval, allow_guest_booking, allow_manager_booking) FROM stdin;
2	Airport Pickup	Comfortable airport transfer service	transportation	60	t	\N	30	2025-07-02 07:51:33.357157	2025-07-02 07:51:33.357157	demo-org	fixed	85.00	\N	\N	f	t	t
3	In-Villa Massage	Professional massage therapist service	massage	\N	t	\N	30	2025-07-02 07:51:33.357157	2025-07-02 07:51:33.357157	demo-org	variable	\N	120.00	120.00	f	t	t
4	Private Chef	Personal chef for in-villa dining	chef	\N	t	\N	30	2025-07-02 07:51:33.357157	2025-07-02 07:51:33.357157	demo-org	variable	\N	85.00	340.00	f	f	t
5	Extra Cleaning	Additional housekeeping service	cleaning	120	t	\N	30	2025-07-02 07:51:33.357157	2025-07-02 07:51:33.357157	demo-org	fixed	75.00	\N	\N	f	t	t
6	Welcome Gift	Complimentary welcome basket	concierge	\N	t	\N	30	2025-07-02 07:51:33.357157	2025-07-02 07:51:33.357157	demo-org	complimentary	0.00	\N	\N	f	f	t
7	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 07:53:44.731919	2025-07-24 07:53:44.731919	default-org	fixed	\N	\N	\N	f	t	t
8	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 07:53:44.731919	2025-07-24 07:53:44.731919	default-org	fixed	\N	\N	\N	f	t	t
9	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 07:53:44.731919	2025-07-24 07:53:44.731919	default-org	fixed	\N	\N	\N	f	t	t
10	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 07:53:44.731919	2025-07-24 07:53:44.731919	default-org	fixed	\N	\N	\N	f	t	t
11	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 07:53:44.731919	2025-07-24 07:53:44.731919	default-org	fixed	\N	\N	\N	f	t	t
12	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:47:58.53627	2025-07-24 15:47:58.53627	default-org	fixed	\N	\N	\N	f	t	t
13	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:47:58.53627	2025-07-24 15:47:58.53627	default-org	fixed	\N	\N	\N	f	t	t
14	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:47:58.53627	2025-07-24 15:47:58.53627	default-org	fixed	\N	\N	\N	f	t	t
15	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:47:58.53627	2025-07-24 15:47:58.53627	default-org	fixed	\N	\N	\N	f	t	t
16	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:47:58.53627	2025-07-24 15:47:58.53627	default-org	fixed	\N	\N	\N	f	t	t
17	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:48:19.638357	2025-07-24 15:48:19.638357	default-org	fixed	\N	\N	\N	f	t	t
18	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:48:19.638357	2025-07-24 15:48:19.638357	default-org	fixed	\N	\N	\N	f	t	t
19	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:48:19.638357	2025-07-24 15:48:19.638357	default-org	fixed	\N	\N	\N	f	t	t
20	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:48:19.638357	2025-07-24 15:48:19.638357	default-org	fixed	\N	\N	\N	f	t	t
21	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:48:19.638357	2025-07-24 15:48:19.638357	default-org	fixed	\N	\N	\N	f	t	t
22	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:48:38.465315	2025-07-24 15:48:38.465315	default-org	fixed	\N	\N	\N	f	t	t
23	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:48:38.465315	2025-07-24 15:48:38.465315	default-org	fixed	\N	\N	\N	f	t	t
24	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:48:38.465315	2025-07-24 15:48:38.465315	default-org	fixed	\N	\N	\N	f	t	t
25	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:48:38.465315	2025-07-24 15:48:38.465315	default-org	fixed	\N	\N	\N	f	t	t
26	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:48:38.465315	2025-07-24 15:48:38.465315	default-org	fixed	\N	\N	\N	f	t	t
27	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:49:43.032262	2025-07-24 15:49:43.032262	default-org	fixed	\N	\N	\N	f	t	t
28	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:49:43.032262	2025-07-24 15:49:43.032262	default-org	fixed	\N	\N	\N	f	t	t
29	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:49:43.032262	2025-07-24 15:49:43.032262	default-org	fixed	\N	\N	\N	f	t	t
30	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:49:43.032262	2025-07-24 15:49:43.032262	default-org	fixed	\N	\N	\N	f	t	t
31	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:49:43.032262	2025-07-24 15:49:43.032262	default-org	fixed	\N	\N	\N	f	t	t
32	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:50:04.803182	2025-07-24 15:50:04.803182	default-org	fixed	\N	\N	\N	f	t	t
33	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:50:04.803182	2025-07-24 15:50:04.803182	default-org	fixed	\N	\N	\N	f	t	t
34	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:50:04.803182	2025-07-24 15:50:04.803182	default-org	fixed	\N	\N	\N	f	t	t
35	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:50:04.803182	2025-07-24 15:50:04.803182	default-org	fixed	\N	\N	\N	f	t	t
36	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:50:04.803182	2025-07-24 15:50:04.803182	default-org	fixed	\N	\N	\N	f	t	t
37	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:53:43.105666	2025-07-24 15:53:43.105666	default-org	fixed	\N	\N	\N	f	t	t
38	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:53:43.105666	2025-07-24 15:53:43.105666	default-org	fixed	\N	\N	\N	f	t	t
39	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:53:43.105666	2025-07-24 15:53:43.105666	default-org	fixed	\N	\N	\N	f	t	t
40	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:53:43.105666	2025-07-24 15:53:43.105666	default-org	fixed	\N	\N	\N	f	t	t
41	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:53:43.105666	2025-07-24 15:53:43.105666	default-org	fixed	\N	\N	\N	f	t	t
42	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 15:54:07.053899	2025-07-24 15:54:07.053899	default-org	fixed	\N	\N	\N	f	t	t
43	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 15:54:07.053899	2025-07-24 15:54:07.053899	default-org	fixed	\N	\N	\N	f	t	t
44	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 15:54:07.053899	2025-07-24 15:54:07.053899	default-org	fixed	\N	\N	\N	f	t	t
45	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 15:54:07.053899	2025-07-24 15:54:07.053899	default-org	fixed	\N	\N	\N	f	t	t
46	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 15:54:07.053899	2025-07-24 15:54:07.053899	default-org	fixed	\N	\N	\N	f	t	t
47	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 16:02:46.05578	2025-07-24 16:02:46.05578	default-org	fixed	\N	\N	\N	f	t	t
48	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 16:02:46.05578	2025-07-24 16:02:46.05578	default-org	fixed	\N	\N	\N	f	t	t
49	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 16:02:46.05578	2025-07-24 16:02:46.05578	default-org	fixed	\N	\N	\N	f	t	t
50	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 16:02:46.05578	2025-07-24 16:02:46.05578	default-org	fixed	\N	\N	\N	f	t	t
51	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 16:02:46.05578	2025-07-24 16:02:46.05578	default-org	fixed	\N	\N	\N	f	t	t
52	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 16:06:37.485348	2025-07-24 16:06:37.485348	default-org	fixed	\N	\N	\N	f	t	t
53	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 16:06:37.485348	2025-07-24 16:06:37.485348	default-org	fixed	\N	\N	\N	f	t	t
54	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 16:06:37.485348	2025-07-24 16:06:37.485348	default-org	fixed	\N	\N	\N	f	t	t
55	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 16:06:37.485348	2025-07-24 16:06:37.485348	default-org	fixed	\N	\N	\N	f	t	t
56	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 16:06:37.485348	2025-07-24 16:06:37.485348	default-org	fixed	\N	\N	\N	f	t	t
57	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 16:07:28.724575	2025-07-24 16:07:28.724575	default-org	fixed	\N	\N	\N	f	t	t
58	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 16:07:28.724575	2025-07-24 16:07:28.724575	default-org	fixed	\N	\N	\N	f	t	t
59	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 16:07:28.724575	2025-07-24 16:07:28.724575	default-org	fixed	\N	\N	\N	f	t	t
60	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 16:07:28.724575	2025-07-24 16:07:28.724575	default-org	fixed	\N	\N	\N	f	t	t
61	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 16:07:28.724575	2025-07-24 16:07:28.724575	default-org	fixed	\N	\N	\N	f	t	t
62	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 17:51:06.938814	2025-07-24 17:51:06.938814	default-org	fixed	\N	\N	\N	f	t	t
63	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 17:51:06.938814	2025-07-24 17:51:06.938814	default-org	fixed	\N	\N	\N	f	t	t
64	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 17:51:06.938814	2025-07-24 17:51:06.938814	default-org	fixed	\N	\N	\N	f	t	t
65	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 17:51:06.938814	2025-07-24 17:51:06.938814	default-org	fixed	\N	\N	\N	f	t	t
66	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 17:51:06.938814	2025-07-24 17:51:06.938814	default-org	fixed	\N	\N	\N	f	t	t
67	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 17:52:29.178833	2025-07-24 17:52:29.178833	default-org	fixed	\N	\N	\N	f	t	t
68	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 17:52:29.178833	2025-07-24 17:52:29.178833	default-org	fixed	\N	\N	\N	f	t	t
69	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 17:52:29.178833	2025-07-24 17:52:29.178833	default-org	fixed	\N	\N	\N	f	t	t
70	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 17:52:29.178833	2025-07-24 17:52:29.178833	default-org	fixed	\N	\N	\N	f	t	t
71	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 17:52:29.178833	2025-07-24 17:52:29.178833	default-org	fixed	\N	\N	\N	f	t	t
72	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 17:57:11.441731	2025-07-24 17:57:11.441731	default-org	fixed	\N	\N	\N	f	t	t
73	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 17:57:11.441731	2025-07-24 17:57:11.441731	default-org	fixed	\N	\N	\N	f	t	t
74	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 17:57:11.441731	2025-07-24 17:57:11.441731	default-org	fixed	\N	\N	\N	f	t	t
75	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 17:57:11.441731	2025-07-24 17:57:11.441731	default-org	fixed	\N	\N	\N	f	t	t
76	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 17:57:11.441731	2025-07-24 17:57:11.441731	default-org	fixed	\N	\N	\N	f	t	t
77	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 18:18:51.379844	2025-07-24 18:18:51.379844	default-org	fixed	\N	\N	\N	f	t	t
78	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 18:18:51.379844	2025-07-24 18:18:51.379844	default-org	fixed	\N	\N	\N	f	t	t
79	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 18:18:51.379844	2025-07-24 18:18:51.379844	default-org	fixed	\N	\N	\N	f	t	t
80	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 18:18:51.379844	2025-07-24 18:18:51.379844	default-org	fixed	\N	\N	\N	f	t	t
81	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 18:18:51.379844	2025-07-24 18:18:51.379844	default-org	fixed	\N	\N	\N	f	t	t
82	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-24 18:22:30.4467	2025-07-24 18:22:30.4467	default-org	fixed	\N	\N	\N	f	t	t
83	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-24 18:22:30.4467	2025-07-24 18:22:30.4467	default-org	fixed	\N	\N	\N	f	t	t
84	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-24 18:22:30.4467	2025-07-24 18:22:30.4467	default-org	fixed	\N	\N	\N	f	t	t
85	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-24 18:22:30.4467	2025-07-24 18:22:30.4467	default-org	fixed	\N	\N	\N	f	t	t
86	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-24 18:22:30.4467	2025-07-24 18:22:30.4467	default-org	fixed	\N	\N	\N	f	t	t
87	Airport Transfer	Premium airport pickup and drop-off service	transport	\N	t	\N	30	2025-07-25 03:47:34.991779	2025-07-25 03:47:34.991779	default-org	fixed	\N	\N	\N	f	t	t
88	In-House Massage	Professional massage therapy in your accommodation	wellness	\N	t	\N	30	2025-07-25 03:47:34.991779	2025-07-25 03:47:34.991779	default-org	fixed	\N	\N	\N	f	t	t
89	Grocery Pre-Stocking	Pre-arrival grocery shopping and stocking service	convenience	\N	t	\N	30	2025-07-25 03:47:34.991779	2025-07-25 03:47:34.991779	default-org	fixed	\N	\N	\N	f	t	t
90	Private Chef Service	Personal chef for in-home dining experience	dining	\N	t	\N	30	2025-07-25 03:47:34.991779	2025-07-25 03:47:34.991779	default-org	fixed	\N	\N	\N	f	t	t
91	Pet Sitting	Professional pet care during your stay	pet-care	\N	t	\N	30	2025-07-25 03:47:34.991779	2025-07-25 03:47:34.991779	default-org	fixed	\N	\N	\N	f	t	t
\.


--
-- Data for Name: agent_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.agent_bookings (id, organization_id, retail_agent_id, property_id, booking_id, guest_name, guest_email, guest_phone, check_in, check_out, total_amount, commission_rate, commission_amount, booking_status, commission_status, hostaway_booking_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: agent_media_access; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.agent_media_access (id, organization_id, property_id, agent_id, media_file_id, folder_id, access_type, access_reason, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: agent_payouts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.agent_payouts (id, organization_id, agent_id, agent_type, payout_month, total_earnings, payout_amount, payout_status, payout_method, payment_reference, receipt_url, processed_by, notes, requested_at, approved_at, paid_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ai_configuration; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_configuration (id, organization_id, auto_processing_enabled, ai_provider, confidence_threshold, auto_task_creation, require_manager_approval, notification_settings, processing_cooldown, debug_mode, last_updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ai_generated_tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_generated_tasks (id, organization_id, message_id, task_id, guest_id, property_id, department, task_type, urgency, ai_description, ai_keywords, confidence, status, assigned_to, approved_by, approved_at, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ai_media_suggestions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_media_suggestions (id, organization_id, property_id, suggestion_type, suggestion_text, priority, confidence_score, detected_issues, suggested_actions, trigger_source, auto_actionable, status, reviewed_by, review_date, review_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ai_task_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_task_rules (id, organization_id, rule_name, keywords, task_type, task_title, task_description, assign_to_department, default_assignee, priority, auto_assign, is_active, trigger_count, last_triggered, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: booking_cost_breakdowns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.booking_cost_breakdowns (id, organization_id, booking_id, cost_type, description, amount, currency, quantity, unit_price, created_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bookings (id, property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, total_amount, status, hostaway_id, special_requests, created_at, updated_at, organization_id, external_id, currency, booking_reference, guest_total_price, platform_payout, ota_commission_amount, ota_commission_percentage, booking_platform, stripe_fees, net_host_payout, manual_override, override_reason, revenue_verified) FROM stdin;
\.


--
-- Data for Name: commission_earnings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.commission_earnings (id, organization_id, user_id, source_type, source_id, amount, currency, commission_rate, base_amount, period, status, processed_by, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: commission_invoice_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.commission_invoice_items (id, organization_id, invoice_id, commission_log_id, description, property_name, reference_number, commission_date, commission_amount, created_at) FROM stdin;
\.


--
-- Data for Name: commission_invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.commission_invoices (id, organization_id, agent_id, agent_type, invoice_number, invoice_date, period_start, period_end, total_commissions, currency, description, agent_notes, status, submitted_at, approved_at, approved_by, rejected_reason, admin_notes, generated_by, created_at, updated_at, due_date) FROM stdin;
\.


--
-- Data for Name: commission_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.commission_log (id, organization_id, agent_id, agent_type, property_id, booking_id, reference_number, base_amount, commission_rate, commission_amount, currency, status, is_adjustment, original_commission_id, adjustment_reason, processed_by, processed_at, admin_notes, commission_month, commission_year, payout_id, created_at, updated_at) FROM stdin;
1	default-org	demo-agent	retail-agent	1	1	BKG-001-2024	15000.00	10.0	1500.00	THB	pending	f	\N	\N	\N	\N	\N	12	2024	\N	2025-07-02 18:48:07.347107	2025-07-02 18:48:07.347107
2	default-org	demo-agent	retail-agent	2	2	BKG-002-2024	12000.00	8.5	1020.00	THB	paid	f	\N	\N	demo-admin	2024-11-15 00:00:00	\N	11	2024	\N	2025-07-02 18:48:07.392428	2025-07-02 18:48:07.392428
3	default-org	demo-agent	retail-agent	1	3	BKG-003-2024	18000.00	10.0	1800.00	THB	pending	f	\N	\N	\N	\N	\N	12	2024	\N	2025-07-02 18:48:07.426322	2025-07-02 18:48:07.426322
4	default-org	demo-agent	retail-agent	2	4	BKG-004-2024	22000.00	12.0	2640.00	THB	paid	f	\N	\N	demo-admin	2024-10-20 00:00:00	\N	10	2024	\N	2025-07-02 18:48:07.459537	2025-07-02 18:48:07.459537
5	default-org	demo-referral-agent	referral-agent	1	\N	REF-001-2024	25000.00	5.0	1250.00	THB	pending	f	\N	\N	\N	\N	\N	12	2024	\N	2025-07-02 18:48:07.493413	2025-07-02 18:48:07.493413
6	default-org	demo-referral-agent	referral-agent	2	\N	REF-002-2024	30000.00	6.0	1800.00	THB	paid	f	\N	\N	demo-admin	2024-11-25 00:00:00	\N	11	2024	\N	2025-07-02 18:48:07.527542	2025-07-02 18:48:07.527542
7	default-org	demo-referral-agent	referral-agent	1	\N	REF-003-2024	20000.00	5.5	1100.00	THB	pending	f	\N	\N	\N	\N	\N	12	2024	\N	2025-07-02 18:48:07.561476	2025-07-02 18:48:07.561476
\.


--
-- Data for Name: custom_expense_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.custom_expense_categories (id, organization_id, category_name, description, billing_cycle, default_amount, currency, display_order, created_by, created_at, updated_at, is_recurring, auto_reminder, reminder_days, is_active) FROM stdin;
1	demo-org-1	Gas	Cooking gas and propane cylinders	monthly	500	THB	1	demo-admin	2025-07-02 17:17:46.486995	2025-07-02 17:17:46.486995	t	t	5	t
2	demo-org-1	Pest Control	Regular pest control services	monthly	800	THB	2	demo-admin	2025-07-02 17:17:46.486995	2025-07-02 17:17:46.486995	t	t	5	t
3	demo-org-1	Residence Fee	Building or community fees	monthly	1200	THB	3	demo-admin	2025-07-02 17:17:46.486995	2025-07-02 17:17:46.486995	t	t	5	t
4	demo-org-1	Security Service	Security guard or monitoring service	monthly	2000	THB	4	demo-admin	2025-07-02 17:17:46.486995	2025-07-02 17:17:46.486995	t	t	5	t
5	demo-org-1	Landscaping	Garden maintenance and landscaping	monthly	1500	THB	5	demo-admin	2025-07-02 17:17:46.486995	2025-07-02 17:17:46.486995	t	t	5	t
\.


--
-- Data for Name: feedback_processing_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feedback_processing_log (id, organization_id, feedback_id, processing_type, triggered_rule_id, matched_keywords, confidence_score, action_taken, created_task_id, processed_by, ai_model, processing_time, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: finances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.finances (id, property_id, booking_id, type, category, amount, description, date, status, created_at, updated_at, subcategory, due_date, is_recurring, recurring_type, next_due_date, owner_id, agent_id, commission_rate, source, source_type, processed_by, reference_number, attachment_url) FROM stdin;
2	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:47:58.580324	2025-07-24 15:47:58.580324	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
3	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:47:58.580324	2025-07-24 15:47:58.580324	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
4	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:47:58.580324	2025-07-24 15:47:58.580324	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
5	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:47:58.580324	2025-07-24 15:47:58.580324	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
6	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:47:58.580324	2025-07-24 15:47:58.580324	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
7	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:48:19.6827	2025-07-24 15:48:19.6827	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
8	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:48:19.6827	2025-07-24 15:48:19.6827	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
9	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:48:19.6827	2025-07-24 15:48:19.6827	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
10	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:48:19.6827	2025-07-24 15:48:19.6827	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
11	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:48:19.6827	2025-07-24 15:48:19.6827	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
12	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:48:38.505537	2025-07-24 15:48:38.505537	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
13	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:48:38.505537	2025-07-24 15:48:38.505537	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
14	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:48:38.505537	2025-07-24 15:48:38.505537	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
15	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:48:38.505537	2025-07-24 15:48:38.505537	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
16	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:48:38.505537	2025-07-24 15:48:38.505537	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
17	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:49:43.072082	2025-07-24 15:49:43.072082	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
18	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:49:43.072082	2025-07-24 15:49:43.072082	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
19	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:49:43.072082	2025-07-24 15:49:43.072082	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
20	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:49:43.072082	2025-07-24 15:49:43.072082	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
21	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:49:43.072082	2025-07-24 15:49:43.072082	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
22	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:50:04.838832	2025-07-24 15:50:04.838832	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
23	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:50:04.838832	2025-07-24 15:50:04.838832	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
24	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:50:04.838832	2025-07-24 15:50:04.838832	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
25	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:50:04.838832	2025-07-24 15:50:04.838832	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
26	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:50:04.838832	2025-07-24 15:50:04.838832	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
27	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:53:43.149651	2025-07-24 15:53:43.149651	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
28	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:53:43.149651	2025-07-24 15:53:43.149651	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
29	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:53:43.149651	2025-07-24 15:53:43.149651	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
30	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:53:43.149651	2025-07-24 15:53:43.149651	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
31	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:53:43.149651	2025-07-24 15:53:43.149651	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
32	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 15:54:07.09273	2025-07-24 15:54:07.09273	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
33	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 15:54:07.09273	2025-07-24 15:54:07.09273	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
34	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 15:54:07.09273	2025-07-24 15:54:07.09273	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
35	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 15:54:07.09273	2025-07-24 15:54:07.09273	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
36	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 15:54:07.09273	2025-07-24 15:54:07.09273	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
37	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 16:02:46.100463	2025-07-24 16:02:46.100463	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
38	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 16:02:46.100463	2025-07-24 16:02:46.100463	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
39	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 16:02:46.100463	2025-07-24 16:02:46.100463	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
40	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 16:02:46.100463	2025-07-24 16:02:46.100463	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
41	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 16:02:46.100463	2025-07-24 16:02:46.100463	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
42	1	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 16:06:37.533449	2025-07-24 16:06:37.533449	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
43	1	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 16:06:37.533449	2025-07-24 16:06:37.533449	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
44	2	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 16:06:37.533449	2025-07-24 16:06:37.533449	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
45	3	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 16:06:37.533449	2025-07-24 16:06:37.533449	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
46	4	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 16:06:37.533449	2025-07-24 16:06:37.533449	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
47	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 16:07:28.760061	2025-07-24 16:07:28.760061	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
48	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 16:07:28.760061	2025-07-24 16:07:28.760061	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
49	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 16:07:28.760061	2025-07-24 16:07:28.760061	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
50	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 16:07:28.760061	2025-07-24 16:07:28.760061	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
51	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 16:07:28.760061	2025-07-24 16:07:28.760061	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
52	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 17:51:06.989951	2025-07-24 17:51:06.989951	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
53	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 17:51:06.989951	2025-07-24 17:51:06.989951	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
54	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 17:51:06.989951	2025-07-24 17:51:06.989951	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
55	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 17:51:06.989951	2025-07-24 17:51:06.989951	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
56	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 17:51:06.989951	2025-07-24 17:51:06.989951	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
57	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 17:52:29.216761	2025-07-24 17:52:29.216761	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
58	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 17:52:29.216761	2025-07-24 17:52:29.216761	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
59	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 17:52:29.216761	2025-07-24 17:52:29.216761	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
60	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 17:52:29.216761	2025-07-24 17:52:29.216761	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
61	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 17:52:29.216761	2025-07-24 17:52:29.216761	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
62	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 17:57:11.483122	2025-07-24 17:57:11.483122	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
63	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 17:57:11.483122	2025-07-24 17:57:11.483122	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
64	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 17:57:11.483122	2025-07-24 17:57:11.483122	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
65	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 17:57:11.483122	2025-07-24 17:57:11.483122	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
66	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 17:57:11.483122	2025-07-24 17:57:11.483122	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
67	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 18:18:51.436778	2025-07-24 18:18:51.436778	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
68	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 18:18:51.436778	2025-07-24 18:18:51.436778	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
69	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 18:18:51.436778	2025-07-24 18:18:51.436778	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
70	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 18:18:51.436778	2025-07-24 18:18:51.436778	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
71	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 18:18:51.436778	2025-07-24 18:18:51.436778	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
72	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-24 18:22:30.488903	2025-07-24 18:22:30.488903	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
73	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-24 18:22:30.488903	2025-07-24 18:22:30.488903	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
74	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-24 18:22:30.488903	2025-07-24 18:22:30.488903	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
75	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-24 18:22:30.488903	2025-07-24 18:22:30.488903	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
76	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-24 18:22:30.488903	2025-07-24 18:22:30.488903	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
77	3	\N	income	booking-payment	1200.00	Direct booking payment - December stay	2024-12-15	pending	2025-07-25 03:47:35.03163	2025-07-25 03:47:35.03163	\N	\N	f	\N	\N	\N	\N	\N	guest_payment	\N	staff-1	DB-2024-001	\N
78	3	\N	expense	commission	180.00	Retail agent commission - December booking	2024-12-15	pending	2025-07-25 03:47:35.03163	2025-07-25 03:47:35.03163	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	staff-1	COMM-2024-001	\N
79	4	\N	expense	maintenance	250.00	Property maintenance - AC service	2024-12-20	pending	2025-07-25 03:47:35.03163	2025-07-25 03:47:35.03163	\N	\N	f	\N	\N	\N	\N	\N	owner_charge	\N	staff-2	MAINT-2024-002	\N
80	5	\N	income	add-on-service	100.00	Owner gift - Welcome basket upgrade	2024-12-18	pending	2025-07-25 03:47:35.03163	2025-07-25 03:47:35.03163	\N	\N	f	\N	\N	\N	\N	\N	complimentary	\N	staff-3	GIFT-2024-001	\N
81	6	\N	expense	commission	75.00	Marketing campaign - Google Ads	2024-12-22	pending	2025-07-25 03:47:35.03163	2025-07-25 03:47:35.03163	\N	\N	f	\N	\N	\N	\N	\N	company_expense	\N	agent-1	MKT-2024-003	\N
\.


--
-- Data for Name: financial_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.financial_transactions (id, organization_id, transaction_type, amount, currency, from_party, to_party, reference_type, reference_id, booking_reference, source_platform, platform_booking_id, description, category, status, processed_by, processed_at, receipt_url, invoice_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_activity_timeline; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_activity_timeline (id, organization_id, guest_session_id, booking_id, activity_type, title, description, status, requested_at, confirmed_at, completed_at, estimated_cost, actual_cost, charge_assignment, is_visible, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_addon_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_addon_bookings (id, organization_id, service_id, property_id, guest_name, guest_email, guest_phone, booking_date, service_date, status, total_amount, currency, billing_route, complimentary_type, payment_status, payment_method, stripe_payment_intent_id, special_requests, internal_notes, assigned_task_id, created_at, updated_at, booked_by, confirmed_by, cancelled_by, cancellation_reason) FROM stdin;
1	default-org	1	1	Sarah Johnson	sarah.j@email.com	+61404123456	2025-07-02 13:42:09.449842	2025-01-15 14:00:00	confirmed	120.00	AUD	guest_billable	\N	paid	\N	\N	Prefer Swedish massage technique	\N	\N	2025-07-02 13:42:09.449842	2025-07-02 13:42:09.449842	\N	\N	\N	\N
2	default-org	2	2	Michael Chen	michael.chen@email.com	+61404789012	2025-07-02 13:42:09.449842	2025-01-10 09:00:00	confirmed	80.00	AUD	owner_billable	\N	pending	\N	\N	Flight arrives at 9:30 AM	\N	\N	2025-07-02 13:42:09.449842	2025-07-02 13:42:09.449842	\N	\N	\N	\N
3	default-org	3	1	Emma Wilson	emma.w@email.com	\N	2025-07-02 13:42:09.449842	2025-01-12 10:00:00	pending	75.00	AUD	company_expense	\N	pending	\N	\N	Dietary restrictions: gluten-free items only	\N	\N	2025-07-02 13:42:09.449842	2025-07-02 13:42:09.449842	\N	\N	\N	\N
4	default-org	5	3	David Taylor	david.taylor@email.com	+61404567890	2025-07-02 13:42:09.449842	2025-01-20 18:00:00	confirmed	200.00	AUD	complimentary	\N	completed	\N	\N	\N	\N	\N	2025-07-02 13:42:09.449842	2025-07-02 13:42:09.449842	\N	\N	\N	\N
\.


--
-- Data for Name: guest_addon_service_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_addon_service_requests (id, organization_id, guest_session_id, booking_id, service_id, service_name, service_type, requested_date, requested_time, duration, guest_count, unit_price, quantity, total_cost, charge_assignment, assignment_reason, special_requests, guest_notes, request_status, confirmed_by, confirmed_at, completed_at, completion_notes, guest_rating, guest_review, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_addon_services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_addon_services (id, organization_id, service_name, description, category, pricing_type, base_price, currency, is_active, requires_time_slot, max_advance_booking_days, cancellation_policy_hours, auto_create_task, task_type, task_priority, created_at, updated_at, created_by) FROM stdin;
1	default-org	In-Room Massage	Professional therapeutic massage service in the comfort of your accommodation	wellness	fixed	120.00	AUD	t	t	30	24	t	service	medium	2025-07-02 13:41:58.763897	2025-07-02 13:41:58.763897	\N
2	default-org	Airport Transfer	Private vehicle transfer to/from airport with professional driver	transport	fixed	80.00	AUD	t	f	30	24	t	service	high	2025-07-02 13:41:58.763897	2025-07-02 13:41:58.763897	\N
3	default-org	Grocery Shopping	Pre-arrival grocery shopping and stocking service	catering	variable	50.00	AUD	t	f	30	24	t	service	low	2025-07-02 13:41:58.763897	2025-07-02 13:41:58.763897	\N
4	default-org	Deep Cleaning	Enhanced cleaning service for extended stays	cleaning	fixed	150.00	AUD	t	f	30	24	t	cleaning	medium	2025-07-02 13:41:58.763897	2025-07-02 13:41:58.763897	\N
5	default-org	Wine Tasting Experience	Curated local wine selection with tasting notes	catering	fixed	200.00	AUD	t	t	30	24	f	service	low	2025-07-02 13:41:58.763897	2025-07-02 13:41:58.763897	\N
6	default-org	House Cleaning	Professional cleaning service including bathroom, kitchen, living areas, and bedrooms	cleaning	fixed	120.00	AUD	t	t	7	24	t	cleaning	medium	2025-07-02 15:09:37.63967	2025-07-02 15:09:37.63967	demo-admin
7	default-org	Airport Transfer	Private transfer service to/from airport with meet and greet	transport	fixed	85.00	AUD	t	t	14	48	t	transport	high	2025-07-02 15:09:37.63967	2025-07-02 15:09:37.63967	demo-admin
8	default-org	In-House Massage	Relaxing 60-minute Swedish massage in the comfort of your accommodation	wellness	fixed	150.00	AUD	t	t	3	12	t	wellness	medium	2025-07-02 15:09:37.63967	2025-07-02 15:09:37.63967	demo-admin
9	default-org	Grocery Shopping	Pre-arrival grocery shopping service - stock your fridge before arrival	concierge	variable	25.00	AUD	t	f	5	24	t	concierge	low	2025-07-02 15:09:37.63967	2025-07-02 15:09:37.63967	demo-admin
10	default-org	Welcome Dinner	Prepared meal service featuring local cuisine delivered on arrival day	catering	fixed	75.00	AUD	t	f	2	6	t	catering	medium	2025-07-02 15:09:37.63967	2025-07-02 15:09:37.63967	demo-admin
\.


--
-- Data for Name: guest_ai_faq_knowledge; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_ai_faq_knowledge (id, organization_id, property_id, question_keyword, response_text, category, priority, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_chat_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_chat_messages (id, organization_id, guest_session_id, booking_id, message_type, sender_type, message_content, message_thread_id, ai_processed, detected_issue, issue_severity, requires_staff_response, sent_at, created_at) FROM stdin;
\.


--
-- Data for Name: guest_feedback; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_feedback (id, organization_id, booking_id, property_id, guest_name, guest_email, feedback_type, feedback_channel, original_message, detected_keywords, sentiment_score, urgency_level, is_processed, requires_action, assigned_task_id, processed_by, processing_notes, received_at, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_maintenance_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_maintenance_reports (id, organization_id, guest_session_id, booking_id, property_id, issue_type, issue_title, issue_description, location_in_property, severity_level, report_images, report_videos, report_status, assigned_to, assigned_at, estimated_resolution_time, actual_resolution_time, resolution_notes, resolution_images, reported_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_messages (id, organization_id, guest_id, guest_name, guest_email, booking_id, property_id, message_content, message_type, priority, status, ai_processed, ai_keywords, ai_sentiment, ai_confidence, ai_suggestions, staff_response, responded_by, responded_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_portal_access; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_portal_access (id, organization_id, property_id, guest_email, access_token, expires_at, is_active, booking_reference, created_at, updated_at, guest_name, check_in_date, check_out_date, created_by, last_accessed_at) FROM stdin;
\.


--
-- Data for Name: guest_portal_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_portal_sessions (id, organization_id, booking_id, guest_email, access_token, property_id, check_in_date, check_out_date, guest_name, guest_phone, is_active, expires_at, last_accessed, created_at) FROM stdin;
\.


--
-- Data for Name: guest_property_local_info; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_property_local_info (id, organization_id, property_id, location_type, location_name, description, location_address, distance_from_property, estimated_cost, recommendation_score, operating_hours, contact_info, booking_url, display_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guest_service_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guest_service_requests (id, organization_id, guest_id, guest_name, booking_id, property_id, service_type, service_name, requested_date, requested_time, number_of_guests, special_requests, estimated_cost, currency, payment_method, status, confirmed_by, confirmed_at, completed_at, guest_rating, guest_feedback, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory (id, property_id, item_name, category, quantity, min_quantity, unit_cost, supplier, last_restocked, created_at, updated_at, usage_tracking) FROM stdin;
\.


--
-- Data for Name: invoice_line_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invoice_line_items (id, invoice_id, description, quantity, unit_price, total_price, reference_id, reference_type) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invoices (id, organization_id, invoice_number, sender_type, sender_id, sender_name, sender_address, receiver_type, receiver_id, receiver_name, receiver_address, invoice_type, description, subtotal, tax_rate, tax_amount, total_amount, currency, status, due_date, paid_date, reference_number, notes, attachments, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: maintenance_approval_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_approval_logs (id, organization_id, suggestion_id, action, action_by, action_reason, previous_status, new_status, approval_notes, created_at) FROM stdin;
\.


--
-- Data for Name: maintenance_suggestion_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_suggestion_settings (id, organization_id, owner_approval_required, auto_approve_under_amount, approval_timeout_days, require_multiple_quotes, multiple_quotes_threshold, require_photos, require_detailed_description, max_attachment_size, allowed_file_types, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: maintenance_suggestions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_suggestions (id, organization_id, property_id, title, maintenance_type, description, estimated_cost, is_urgent, photos, status, approval_status, owner_comments, suggested_by, approved_by, payment_responsibility, external_contractor_required, preferred_contractor_id, completion_deadline, approval_deadline, task_created_id, finance_entry_id, timeline_entry_id, created_at, updated_at, urgency_level, currency, cost_breakdown, who_pays_cost, attachments, evidence_photos, supporting_documents, submitted_by_role, submission_reason, owner_response, owner_response_notes, owner_responded_at, external_contractor_info, task_created_at, finance_recorded_at, system_notes, visible_to_owner, notification_sent_at, reminder_count, submitted_by) FROM stdin;
\.


--
-- Data for Name: maintenance_timeline_entries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_timeline_entries (id, organization_id, property_id, suggestion_id, entry_type, entry_title, entry_description, entry_icon, visible_to_owner, visible_to_staff, visible_to_guests, created_by, affects_users, created_at) FROM stdin;
\.


--
-- Data for Name: marketplace_service_analytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketplace_service_analytics (id, organization_id, service_id, property_id, period_start, period_end, total_bookings, total_revenue, average_rating, most_requested_time, peak_season_months, customer_satisfaction_score, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: marketplace_services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketplace_services (id, organization_id, vendor_id, category_id, name, description, short_description, photos, pricing_type, base_price, currency, price_notes, requires_approval, requires_pre_payment, cancellation_policy, duration, availability, booking_instructions, special_notes, tags, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: media_folders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.media_folders (id, organization_id, property_id, folder_name, folder_description, cloud_folder_link, cloud_provider, access_level, is_agent_approved, sort_order, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: media_usage_analytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.media_usage_analytics (id, organization_id, property_id, media_file_id, view_count, download_count, share_count, weekly_views, monthly_views, popularity_score, last_accessed, trending_score, reset_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_preferences (id, organization_id, user_id, enable_in_app, enable_email, enable_sms, enable_whatsapp, enable_line, task_assignments, booking_updates, payout_actions, maintenance_approvals, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, organization_id, user_id, type, title, message, related_entity_type, related_entity_id, priority, is_read, read_at, action_url, action_label, created_by, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: onboarding_step_details; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.onboarding_step_details (id, organization_id, onboarding_id, step_number, step_name, step_description, is_completed, completed_at, completed_by, step_data, validation_errors, attempt_count, last_attempt_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: organization_api_keys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.organization_api_keys (id, organization_id, provider, key_name, encrypted_value, description, is_active, last_used, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.organizations (id, name, domain, subdomain, company_logo, settings, subscription_tier, max_users, max_properties, is_active, trial_ends_at, created_at, updated_at) FROM stdin;
default-org	Default Organization	localhost:5000	default	\N	\N	basic	10	50	t	\N	2025-07-02 12:09:02.968595	2025-07-02 12:09:02.968595
demo-org	Demo Organization	demo.hostpilotpro.com	demo	\N	\N	pro	50	100	t	\N	2025-07-05 18:22:36.131477	2025-07-05 18:22:36.131477
\.


--
-- Data for Name: owner_activity_timeline; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_activity_timeline (id, organization_id, property_id, owner_id, activity_type, title, description, metadata, reference_id, reference_type, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: owner_balances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_balances (id, organization_id, owner_id, current_balance, total_earnings, total_expenses, total_payouts_requested, total_payouts_paid, this_month_earnings, this_month_expenses, this_month_net, last_calculated, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_charge_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_charge_requests (id, organization_id, owner_id, charged_by, amount, currency, reason, description, due_date, payment_method, payment_reference, payment_receipt_url, status, charged_at, paid_at, processed_by) FROM stdin;
\.


--
-- Data for Name: owner_documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_documents (id, organization_id, process_id, owner_id, property_id, category, file_name, original_file_name, file_type, file_path, title, description, file_url, file_size, mime_type, has_expiration, expiration_date, expiration_alert_sent, status, uploaded_by, reviewed_by, reviewed_at, review_comments, is_public, visibility, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_financial_summary; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_financial_summary (id, organization_id, owner_id, property_id, period_start, period_end, rental_income, addon_revenue, management_fees, utility_deductions, service_deductions, net_balance, breakdown, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_invoices (id, organization_id, owner_id, property_id, invoice_number, invoice_type, title, description, amount, currency, period_start, period_end, due_date, status, pdf_url, metadata, created_at, created_by, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_onboarding_processes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_onboarding_processes (id, organization_id, owner_id, property_id, step1_owner_contact_info, step2_property_basics, step3_location_mapping, step4_photo_uploads, step5_property_description, step6_utility_info, step7_legal_documents, step8_security_access, step9_services_setup, total_steps, completed_steps, progress_percentage, current_step, onboarding_deadline, deadline_set_by, priority, estimated_days_remaining, is_overdue, admin_notes, owner_instructions, next_step_instructions, last_activity_at, last_updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_payout_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_payout_requests (id, organization_id, owner_id, amount, currency, period_start, period_end, status, request_notes, admin_notes, payment_receipt_url, payment_method, payment_reference, requested_at, approved_at, approved_by, payment_uploaded_at, payment_uploaded_by, completed_at, completed_by) FROM stdin;
1	default-org	demo-owner	2500.00	AUD	2024-12-01	2024-12-31	completed	December earnings payout	\N	\N	\N	\N	2025-07-02 15:21:21.332163	\N	\N	\N	\N	\N	\N
2	default-org	demo-owner	3200.00	AUD	2025-01-01	2025-01-31	pending	January earnings - includes addon revenue	\N	\N	\N	\N	2025-07-02 15:21:21.332163	\N	\N	\N	\N	\N	\N
3	default-org	demo-owner	1800.00	AUD	2024-11-01	2024-11-30	approved	November earnings payout	\N	\N	\N	\N	2025-07-02 15:21:21.332163	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: owner_payouts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_payouts (id, organization_id, owner_id, property_id, requested_amount, currency, status, request_date, requested_by, request_notes, approved_by, approved_date, approval_notes, payment_method, payment_reference, payment_date, paid_by, receipt_url, receipt_uploaded_by, receipt_uploaded_date, confirmed_by, confirmed_date, period_start_date, period_end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_preferences (id, organization_id, owner_id, task_approval_required, maintenance_alerts, guest_addon_notifications, financial_notifications, weekly_reports, preferred_currency, notification_email, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: owner_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_settings (id, organization_id, owner_id, task_approval_required, maintenance_alerts, guest_addon_notifications, financial_notifications, weekly_reports, preferred_currency, notification_email, created_at, updated_at) FROM stdin;
1	default-org	demo-owner	t	t	t	t	t	AUD	owner@hostpilotpro.com	2025-07-02 15:21:28.905579	2025-07-02 15:21:28.905579
\.


--
-- Data for Name: owner_timeline_activity; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.owner_timeline_activity (id, organization_id, owner_id, property_id, activity_type, title, description, property_name, metadata, created_at) FROM stdin;
6	default-org	demo-owner	1	check_in	Guest Check-in	John Smith checked in for 3 nights	Beachfront Villa	\N	2025-07-02 15:20:58.51747
7	default-org	demo-owner	1	task_completed	Cleaning Completed	Property cleaned and inspected	Beachfront Villa	\N	2025-07-02 15:20:58.51747
8	default-org	demo-owner	2	guest_feedback	Positive Review	Guest left 5-star review mentioning excellent cleanliness	City Apartment	\N	2025-07-02 15:20:58.51747
9	default-org	demo-owner	1	addon_booking	Massage Service Booked	Guest booked in-room massage for $150	Beachfront Villa	\N	2025-07-02 15:20:58.51747
10	default-org	demo-owner	2	bill_uploaded	Utility Bill Uploaded	Electricity bill for March uploaded ($89.50)	City Apartment	\N	2025-07-02 15:20:58.51747
\.


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.platform_settings (id, setting_key, setting_value, setting_type, category, description, is_secret, updated_by, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: pm_commission_balance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pm_commission_balance (id, organization_id, manager_id, total_earned, total_paid, current_balance, last_payout_date, created_at, updated_at) FROM stdin;
1	default-org	pm	2500.00	1500.00	1000.00	\N	2025-07-02 15:30:24.793979	2025-07-02 15:30:24.793979
\.


--
-- Data for Name: pm_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pm_notifications (id, organization_id, manager_id, type, title, message, severity, action_required, is_read, related_type, related_id, created_at) FROM stdin;
1	default-org	pm	task_completed	Maintenance Task Completed	Pool cleaning has been completed at Ocean View Villa	info	f	f	\N	\N	2025-07-02 15:30:35.793715
2	default-org	pm	booking_update	New Booking Received	New 5-night booking for Mountain Lodge starting Dec 20th	info	f	f	\N	\N	2025-07-02 15:30:35.793715
3	default-org	pm	maintenance_alert	Urgent Maintenance Required	HVAC system failure reported at Downtown Apartment	urgent	t	f	\N	\N	2025-07-02 15:30:35.793715
4	default-org	pm	payout_approved	Commission Payout Approved	Your commission payout of $500 has been approved	info	f	f	\N	\N	2025-07-02 15:30:35.793715
\.


--
-- Data for Name: pm_payout_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pm_payout_requests (id, organization_id, manager_id, amount, currency, request_notes, admin_notes, status, receipt_url, requested_at, approved_at, approved_by, paid_at, created_at, updated_at, processed_by) FROM stdin;
1	default-org	pm	500.00	AUD	Monthly commission withdrawal	\N	approved	\N	2025-06-29 15:30:35.793715	\N	\N	\N	2025-07-02 15:30:35.793715	2025-07-02 15:30:35.793715	\N
2	default-org	pm	750.00	AUD	Quarterly performance bonus	\N	pending	\N	2025-07-01 15:30:35.793715	\N	\N	\N	2025-07-02 15:30:35.793715	2025-07-02 15:30:35.793715	\N
\.


--
-- Data for Name: pm_property_performance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pm_property_performance (id, organization_id, manager_id, property_id, period, revenue, expenses, net_income, commission_earned, occupancy_rate, booking_count, avg_rating, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pm_task_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pm_task_logs (id, organization_id, manager_id, property_id, task_title, department, staff_assigned, status, result, notes, evidence_photos, receipts, completed_at, created_at, updated_at) FROM stdin;
1	default-org	pm	1	Property inspection completed	inspection	staff	completed	Property in excellent condition, minor issues addressed	\N	\N	\N	2025-06-30 15:30:35.793715	2025-07-02 15:30:35.793715	2025-07-02 15:30:35.793715
2	default-org	pm	2	Property inspection completed	inspection	staff	completed	Property in excellent condition, minor issues addressed	\N	\N	\N	2025-06-30 15:30:35.793715	2025-07-02 15:30:35.793715	2025-07-02 15:30:35.793715
\.


--
-- Data for Name: portfolio_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.portfolio_assignments (id, organization_id, manager_id, property_id, commission_rate, assigned_at, unassigned_at, is_active) FROM stdin;
1	default-org	pm	1	10.00	2025-07-02 15:30:24.793979	\N	t
2	default-org	pm	2	10.00	2025-07-02 15:30:24.793979	\N	t
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.properties (id, name, address, description, bedrooms, bathrooms, max_guests, price_per_night, status, amenities, images, hostaway_id, owner_id, created_at, updated_at, organization_id, external_id, currency, google_maps_link) FROM stdin;
3	Villa Aruna (Demo)	Bophut Hills, Koh Samui, Thailand	Stunning 3-bedroom villa with private pool and ocean views in exclusive Bophut Hills location. Perfect for families and groups seeking luxury accommodation in Koh Samui.	3	3	6	20000.00	active	{"Private Pool","Ocean View","Air Conditioning",WiFi,Kitchen,Parking,Garden}	\N	\N	demo-owner	2025-07-04 06:52:47.655594	2025-07-04 06:52:47.655594	default-org	\N	THB	\N
4	Sunset Villa Bondi	123 Ocean View Drive, Bondi Beach, NSW 2026	Stunning beachfront villa with panoramic ocean views. Perfect for families and groups.	4	3	8	450.00	active	\N	\N	\N	owner-1	2025-07-24 07:53:44.598176	2025-07-24 07:53:44.598176	default-org	1001	AUD	\N
5	City Penthouse Melbourne	456 Collins Street, Melbourne, VIC 3000	Luxury penthouse in the heart of Melbourne CBD with skyline views.	3	2	6	380.00	active	\N	\N	\N	owner-1	2025-07-24 07:53:44.598176	2025-07-24 07:53:44.598176	default-org	1002	AUD	\N
6	Harbour View Apartment	789 Circular Quay, Sydney, NSW 2000	Modern apartment overlooking Sydney Harbour Bridge and Opera House.	2	2	4	320.00	active	\N	\N	\N	owner-2	2025-07-24 07:53:44.598176	2025-07-24 07:53:44.598176	default-org	1003	AUD	\N
7	Byron Bay Beach House	321 Beachfront Road, Byron Bay, NSW 2481	Spacious beach house steps from the sand. Ideal for large groups and events.	5	4	10	520.00	active	\N	\N	\N	owner-2	2025-07-24 07:53:44.598176	2025-07-24 07:53:44.598176	default-org	1004	AUD	\N
8	Gold Coast High-Rise	654 Surfers Paradise Blvd, Gold Coast, QLD 4217	Modern high-rise apartment with beach access and resort facilities.	3	2	6	290.00	active	\N	\N	\N	owner-3	2025-07-24 07:53:44.598176	2025-07-24 07:53:44.598176	default-org	1005	AUD	\N
10	Villa Tropical Paradise	456 Hillside Drive, Koh Samui, Thailand	Stunning hillside villa with panoramic ocean views and infinity pool. Ideal for families and groups.	4	4	8	12000.00	active	{"Infinity Pool","Ocean View",WiFi,"Air Conditioning",Kitchen,Parking,Garden}	\N	\N	owner-1	2025-07-24 15:47:58.217125	2025-07-24 15:47:58.217125	default-org	1002	THB	\N
11	Villa Balinese Charm	789 Coconut Grove, Koh Samui, Thailand	Authentic Thai-style villa surrounded by tropical gardens. Perfect for romantic getaways.	2	2	4	6500.00	active	{"Traditional Design","Garden Pool",WiFi,"Air Conditioning","Outdoor Kitchen"}	\N	\N	owner-2	2025-07-24 15:47:58.287428	2025-07-24 15:47:58.287428	default-org	1003	THB	\N
12	Villa Gala Beachfront	321 Beachfront Road, Koh Samui, Thailand	Spectacular beachfront villa with direct beach access. Perfect for large groups and events.	5	5	10	18000.00	active	{Beachfront,"Large Pool",WiFi,"Air Conditioning","Full Kitchen","BBQ Area",Parking}	\N	\N	owner-2	2025-07-24 15:47:58.356972	2025-07-24 15:47:58.356972	default-org	1004	THB	\N
13	Villa Sunset Heights	654 Mountain View Road, Koh Samui, Thailand	Elevated villa with spectacular sunset views and modern amenities. Great for families.	3	3	6	9500.00	active	{"Sunset Views","Modern Pool",WiFi,"Air Conditioning",Kitchen,Parking}	\N	\N	owner-3	2025-07-24 15:47:58.424945	2025-07-24 15:47:58.424945	default-org	1005	THB	\N
14	Villa Samui Breeze	123 Beach Road, Koh Samui, Thailand	Luxurious 3-bedroom villa with private pool and garden on Koh Samui. Perfect for families seeking authentic Thai hospitality.	3	3	6	8000.00	active	{"Private Pool",Garden,WiFi,"Air Conditioning",Kitchen,"Beach Access"}	\N	\N	demo-owner	2025-07-24 15:53:42.335567	2025-07-24 15:53:42.335567	default-org	DEMO-VILLA-001	THB	\N
2	Villa Ocean View	456 Hillside Drive, Koh Samui, Thailand	Cozy 2-bedroom villa with stunning ocean views. Perfect for couples and small families.	2	2	4	6500.00	active	\N	\N	\N	demo-owner	2025-07-02 15:20:50.497492	2025-07-02 15:20:50.497492	default-org	\N	THB	\N
9	Villa Samui Breeze	123 Beach Road, Koh Samui, Thailand	Luxurious 3-bedroom villa with private pool and garden on Koh Samui. Perfect for couples and small families.	3	3	6	8000.00	active	{"Private Pool",Garden,WiFi,"Air Conditioning",Kitchen,"Beach Access"}	\N	\N	owner-1	2025-07-24 15:47:58.135041	2025-07-24 15:47:58.135041	default-org	1001	THB	\N
1	Villa Samui Breeze	123 Beach Road, Koh Samui, Thailand	Luxurious 3-bedroom villa with private pool and garden on Koh Samui. Perfect for couples and small families.	3	3	6	8000.00	active	{"Private Pool",Garden,WiFi,"Air Conditioning",Kitchen,"Beach Access"}	\N	\N	demo-owner	2025-07-02 15:20:50.497492	2025-07-02 15:20:50.497492	default-org	\N	THB	\N
15	Villa Ocean View	456 Hillside Drive, Koh Samui, Thailand	Cozy 2-bedroom villa with stunning ocean views. Perfect for couples and small families.	2	2	4	6500.00	active	{"Ocean View",WiFi,"Air Conditioning",Kitchen,Parking}	\N	\N	demo-owner	2025-07-24 15:53:42.43407	2025-07-24 15:53:42.43407	default-org	DEMO-VILLA-002	THB	\N
16	Villa Aruna (Demo)	Bophut Hills, Koh Samui, Thailand	Stunning 3-bedroom villa with private pool and ocean views in exclusive Bophut Hills location. Perfect for families and groups seeking luxury accommodation in Koh Samui.	3	3	6	20000.00	active	{"Private Pool","Ocean View","Air Conditioning",WiFi,Kitchen,Parking,Garden}	\N	\N	demo-owner	2025-07-24 15:53:42.508657	2025-07-24 15:53:42.508657	default-org	DEMO-VILLA-003	THB	\N
17	Villa Tropical Paradise	789 Coconut Grove, Koh Samui, Thailand	Spacious 4-bedroom villa surrounded by tropical gardens with infinity pool. Ideal for larger families and groups.	4	4	8	12000.00	active	{"Infinity Pool","Tropical Garden",WiFi,"Air Conditioning","Full Kitchen","BBQ Area",Parking}	\N	\N	demo-owner	2025-07-24 15:53:42.584037	2025-07-24 15:53:42.584037	default-org	DEMO-VILLA-004	THB	\N
\.


--
-- Data for Name: property_agents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_agents (id, organization_id, property_id, agent_id, agent_type, assigned_at, is_active, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_custom_expenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_custom_expenses (id, organization_id, property_id, category_id, amount, billing_cycle, next_due_date, is_active, notes, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_media_files; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_media_files (id, organization_id, property_id, file_name, media_type, description, cloud_link, cloud_provider, thumbnail_url, access_level, tags, is_agent_approved, is_unbranded, is_featured, uploaded_by, approved_by, approval_date, file_size_bytes, capture_location, captured_date, last_updated_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_media_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_media_settings (id, organization_id, property_id, auto_approval_enabled, agent_upload_enabled, watermark_enabled, watermark_template, quality_requirements, approval_workflow, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_payout_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_payout_rules (id, organization_id, property_id, airbnb_owner_percent, airbnb_management_percent, vrbo_owner_percent, vrbo_management_percent, booking_owner_percent, booking_management_percent, direct_owner_percent, direct_management_percent, stripe_fee_percent, stripe_fee_note, allow_booking_override, default_currency, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_referrals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_referrals (id, organization_id, property_id, referral_agent_id, referral_date, commission_rate, is_active, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_revenue_targets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_revenue_targets (id, organization_id, property_id, target_year, target_quarter, target_amount, currency, current_revenue, description, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_utility_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_utility_accounts (id, organization_id, property_id, utility_type, provider, account_number, package_info, expected_bill_day, is_active, created_at, updated_at) FROM stdin;
1	demo-org-1	1	electricity	PEA (Provincial Electricity Authority)	EA13982	Residential Standard Rate	15	t	2025-07-03 06:38:22.641428	2025-07-03 06:38:22.641428
2	demo-org-1	1	water	Water Authority	WA15477	Standard Water Supply	20	t	2025-07-03 06:38:22.677796	2025-07-03 06:38:22.677796
3	demo-org-1	1	internet	AIS	INT14108	AIS Fiber 100/50 Mbps	5	t	2025-07-03 06:38:22.710148	2025-07-03 06:38:22.710148
4	demo-org-1	2	electricity	PEA (Provincial Electricity Authority)	EA28230	Residential Standard Rate	15	t	2025-07-03 06:38:22.742361	2025-07-03 06:38:22.742361
5	demo-org-1	2	water	Water Authority	WA25827	Standard Water Supply	20	t	2025-07-03 06:38:22.774962	2025-07-03 06:38:22.774962
6	demo-org-1	2	internet	AIS	INT20406	AIS Fiber 100/50 Mbps	5	t	2025-07-03 06:38:22.806197	2025-07-03 06:38:22.806197
\.


--
-- Data for Name: property_utility_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.property_utility_settings (id, organization_id, property_id, utility_type, provider_id, account_number, account_holder, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: recurring_service_charges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.recurring_service_charges (id, organization_id, property_id, service_name, service_category, provider_name, provider_contact, monthly_rate, currency, billing_day, charge_assignment, auto_deduct, requires_approval, service_frequency, service_day, service_time, is_active, start_date, end_date, last_charged_date, next_charge_date, notes, contract_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: referral_earnings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.referral_earnings (id, organization_id, referral_agent_id, property_id, earnings_month, management_fee, commission_rate, commission_amount, occupancy_rate, average_review_score, total_bookings, is_confirmed, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_bookings (id, organization_id, service_id, property_id, booking_number, guest_name, guest_email, guest_phone, guest_notes, requested_date, requested_time, estimated_duration, total_amount, currency, billing_assignment, status, payment_status, requested_by, requested_by_role, approved_by, approved_at, rejected_by, rejected_at, rejection_reason, confirmed_by, confirmed_at, started_at, completed_at, completion_notes, cancelled_at, cancellation_reason, internal_notes, vendor_notes, access_instructions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_categories (id, organization_id, name, description, icon, is_active, sort_order, created_at, updated_at, color) FROM stdin;
29	default-org	Home Cleaning	Professional cleaning services for residential properties	home	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#3B82F6
30	default-org	Garden & Landscaping	Garden maintenance and landscaping services	leaf	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#10B981
31	default-org	Pool Maintenance	Swimming pool cleaning and maintenance	droplets	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#06B6D4
32	default-org	Electrical Services	Electrical repairs and installations	zap	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#F59E0B
33	default-org	Plumbing	Plumbing repairs and installations	wrench	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#8B5CF6
34	default-org	AC & HVAC	Air conditioning and heating services	wind	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#EF4444
35	default-org	Pest Control	Professional pest control services	bug	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#F97316
36	default-org	Transportation	Transportation and taxi services	car	t	0	2025-07-04 14:21:31.74077	2025-07-04 14:21:31.74077	#6366F1
37	default-org	Home Cleaning	Professional cleaning services for residential properties	home	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#3B82F6
38	default-org	Garden & Landscaping	Garden maintenance and landscaping services	leaf	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#10B981
39	default-org	Pool Maintenance	Swimming pool cleaning and maintenance	droplets	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#06B6D4
40	default-org	Electrical Services	Electrical repairs and installations	zap	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#F59E0B
41	default-org	Plumbing	Plumbing repairs and installations	wrench	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#8B5CF6
42	default-org	AC & HVAC	Air conditioning and heating services	wind	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#EF4444
43	default-org	Pest Control	Professional pest control services	bug	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#F97316
44	default-org	Transportation	Transportation and taxi services	car	t	0	2025-07-04 14:21:41.74648	2025-07-04 14:21:41.74648	#6366F1
45	default-org	Home Cleaning	Professional cleaning services for residential properties	home	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#3B82F6
46	default-org	Garden & Landscaping	Garden maintenance and landscaping services	leaf	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#10B981
47	default-org	Pool Maintenance	Swimming pool cleaning and maintenance	droplets	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#06B6D4
48	default-org	Electrical Services	Electrical repairs and installations	zap	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#F59E0B
49	default-org	Plumbing	Plumbing repairs and installations	wrench	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#8B5CF6
50	default-org	AC & HVAC	Air conditioning and heating services	wind	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#EF4444
51	default-org	Pest Control	Professional pest control services	bug	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#F97316
52	default-org	Transportation	Transportation and taxi services	car	t	0	2025-07-04 14:21:50.985393	2025-07-04 14:21:50.985393	#6366F1
53	default-org	Home Cleaning	Professional cleaning services for residential properties	home	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#3B82F6
54	default-org	Garden & Landscaping	Garden maintenance and landscaping services	leaf	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#10B981
55	default-org	Pool Maintenance	Swimming pool cleaning and maintenance	droplets	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#06B6D4
56	default-org	Electrical Services	Electrical repairs and installations	zap	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#F59E0B
57	default-org	Plumbing	Plumbing repairs and installations	wrench	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#8B5CF6
58	default-org	AC & HVAC	Air conditioning and heating services	wind	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#EF4444
59	default-org	Pest Control	Professional pest control services	bug	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#F97316
60	default-org	Transportation	Transportation and taxi services	car	t	0	2025-07-04 14:22:01.808153	2025-07-04 14:22:01.808153	#6366F1
61	default-org	Home Cleaning	Professional cleaning services for residential properties	home	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#3B82F6
62	default-org	Garden & Landscaping	Garden maintenance and landscaping services	leaf	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#10B981
63	default-org	Pool Maintenance	Swimming pool cleaning and maintenance	droplets	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#06B6D4
64	default-org	Electrical Services	Electrical repairs and installations	zap	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#F59E0B
65	default-org	Plumbing	Plumbing repairs and installations	wrench	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#8B5CF6
66	default-org	AC & HVAC	Air conditioning and heating services	wind	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#EF4444
67	default-org	Pest Control	Professional pest control services	bug	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#F97316
68	default-org	Transportation	Transportation and taxi services	car	t	0	2025-07-04 14:22:11.315997	2025-07-04 14:22:11.315997	#6366F1
\.


--
-- Data for Name: service_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_reviews (id, organization_id, service_id, booking_id, vendor_id, rating, title, review, reviewer_type, reviewer_name, is_anonymous, quality_rating, timeliness_rating, value_rating, communication_rating, is_approved, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_vendor_analytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_vendor_analytics (id, organization_id, vendor_id, period_start, period_end, total_bookings, completed_bookings, cancelled_bookings, total_revenue, average_rating, response_time_hours, completion_rate, repeat_customer_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_vendors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_vendors (id, organization_id, name, description, logo, vendor_type, contact_person, phone, email, address, website, business_license, tax_id, bank_details, rating, review_count, response_time_hours, commission_rate, is_active, is_verified, available_days, working_hours, payment_terms, delivery_time, service_area, specializations, certifications, tags, notes, created_by, created_at, updated_at, preferred_payment_method) FROM stdin;
6	default-org	Test Vendor	\N	\N	external	\N	\N	\N	\N	\N	\N	\N	\N	5.00	0	24	0.00	t	f	\N	\N	net_30	\N	\N	\N	\N	\N	\N	demo-admin	2025-07-04 14:22:17.540299	2025-07-04 14:22:17.540299	bank_transfer
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire, organization_id) FROM stdin;
Xt84opn3o-IlIvKG-3mXZMViOxVzc90-	{"cookie": {"path": "/", "secure": false, "expires": "2025-07-31T18:33:37.246Z", "httpOnly": true, "originalMaxAge": 604800000}, "userId": "demo-referral"}	2025-08-01 04:10:40	\N
zHkpMA-czOvm0LWxAValP0oWxnm8_pzK	{"cookie": {"path": "/", "secure": false, "expires": "2025-07-31T15:52:15.583Z", "httpOnly": true, "originalMaxAge": 604800000}, "userId": "demo-agent"}	2025-07-31 15:52:16	\N
j_RJLJNZTaJmefbz9xgWDdxZFY1zUV9B	{"cookie": {"path": "/", "secure": false, "expires": "2025-07-28T07:45:02.852Z", "httpOnly": true, "originalMaxAge": 604800000}, "userId": "demo-admin"}	2025-07-28 07:45:13	\N
\.


--
-- Data for Name: staff_salaries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.staff_salaries (id, organization_id, user_id, monthly_salary, currency, bonus_structure, commission_rate, is_active, effective_from, effective_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: task_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.task_history (id, organization_id, task_id, property_id, action, previous_status, new_status, performed_by, notes, evidence_photos, issues_found, "timestamp") FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tasks (id, title, description, type, status, priority, property_id, assigned_to, created_by, due_date, completed_at, estimated_cost, actual_cost, created_at, updated_at, department, is_recurring, recurring_type, recurring_interval, next_due_date, parent_task_id, organization_id, completion_notes, evidence_photos, issues_found, skip_reason, reschedule_reason, rescheduled_date) FROM stdin;
1	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
2	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
3	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
4	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
5	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
6	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 07:53:44.689652	2025-07-24 07:53:44.689652	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
7	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
8	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
9	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
10	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
11	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
12	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:47:58.498639	2025-07-24 15:47:58.498639	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
13	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
14	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
15	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
16	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
17	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
18	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:48:19.597519	2025-07-24 15:48:19.597519	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
19	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
20	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
21	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
22	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
23	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
24	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:48:38.423275	2025-07-24 15:48:38.423275	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
25	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
26	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
27	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
28	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
29	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
30	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:49:42.995176	2025-07-24 15:49:42.995176	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
31	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
32	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
33	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
34	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
35	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
36	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:50:04.75853	2025-07-24 15:50:04.75853	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
37	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
38	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
39	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
40	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
41	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
42	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:53:43.055612	2025-07-24 15:53:43.055612	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
43	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
44	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
45	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
46	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
47	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
48	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 15:54:07.016452	2025-07-24 15:54:07.016452	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
49	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
50	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
51	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
52	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
53	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
54	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 16:02:46.000292	2025-07-24 16:02:46.000292	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
55	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	1	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
56	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	1	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
57	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	2	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
58	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	3	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
59	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	4	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
60	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	5	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 16:06:37.424272	2025-07-24 16:06:37.424272	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
61	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
62	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
63	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
64	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
65	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
66	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 16:07:28.687825	2025-07-24 16:07:28.687825	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
67	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
68	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
69	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
70	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
71	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
72	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 17:51:06.874009	2025-07-24 17:51:06.874009	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
73	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
74	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
75	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
76	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
77	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
78	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 17:52:29.141915	2025-07-24 17:52:29.141915	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
79	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
80	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
81	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
82	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
83	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
84	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 17:57:11.386529	2025-07-24 17:57:11.386529	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
85	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
86	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
87	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
88	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
89	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
90	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 18:18:51.259011	2025-07-24 18:18:51.259011	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
91	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
92	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
93	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
94	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
95	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
96	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-24 18:22:30.391872	2025-07-24 18:22:30.391872	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
97	Deep clean before guest arrival	Complete deep cleaning including windows, carpets, and bathrooms	cleaning	pending	high	3	\N	\N	2025-01-14 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
98	Check pool equipment	Test pool pump, heater, and chemical levels	maintenance	in_progress	medium	3	\N	\N	2025-01-16 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
99	Replace air conditioning filter	Install new HEPA filter in main AC unit	maintenance	pending	medium	4	\N	\N	2025-01-20 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	maintenance	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
100	Stock welcome amenities	Restock coffee, tea, toiletries, and welcome basket	maintenance	completed	low	5	\N	\N	2025-01-10 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	housekeeping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
101	Garden maintenance	Trim hedges, water plants, clean outdoor furniture	maintenance	pending	medium	6	\N	\N	2025-01-18 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	landscaping	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
102	WiFi troubleshooting	Test internet connection and reset router if needed	maintenance	in_progress	high	7	\N	\N	2025-01-15 00:00:00	\N	\N	\N	2025-07-25 03:47:34.939762	2025-07-25 03:47:34.939762	technical	f	\N	1	\N	\N	default-org	\N	{}	{}	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, created_at, updated_at, organization_id, is_active, last_login_at, password) FROM stdin;
demo-referral	referral@demo.com	Test Referral	Agent	\N	referral-agent	2025-07-02 12:13:51.329901	2025-07-25 03:47:33.543	default-org	t	\N	123456
demo-guest	guest@hostpilotpro.com	Guest	User	\N	guest	2025-07-02 12:13:51.362992	2025-07-25 03:47:33.578	default-org	t	\N	123456
agent1	agent1@example.com	Agent	One	\N	retail-agent	2025-07-02 15:39:12.346025	2025-07-25 03:47:33.613	default-org	t	\N	\N
owner-1	sarah.mitchell@email.com	Sarah	Mitchell	\N	owner	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
owner-2	james.brown@email.com	James	Brown	\N	owner	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
owner-3	maria.garcia@email.com	Maria	Garcia	\N	owner	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
staff-1	alex.johnson@demo.com	Alex	Johnson	\N	staff	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
staff-2	emma.wilson@demo.com	Emma	Wilson	\N	staff	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
staff-3	michael.lee@demo.com	Michael	Lee	\N	staff	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
admin-001	admin@demo.com	Admin	User	\N	admin	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	$2b$12$LQv3c1yqBWVHxkd0LQ1lqu.Y5qktJ8j1GrCJFhyH2mH8mO8L9Z8Fe
manager-001	manager@demo.com	Portfolio	Manager	\N	portfolio-manager	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	$2b$12$LQv3c1yqBWVHxkd0LQ1lqu.Y5qktJ8j1GrCJFhyH2mH8mO8L9Z8Fe
demo-retail	retail@hostpilotpro.com	Retail	Agent	\N	retail-agent	2025-07-02 12:13:51.296592	2025-07-02 18:03:28.739	default-org	t	\N	\N
owner-001	owner@demo.com	Property	Owner	\N	owner	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	$2b$12$LQv3c1yqBWVHxkd0LQ1lqu.Y5qktJ8j1GrCJFhyH2mH8mO8L9Z8Fe
staff-001	staff@demo.com	Staff	Member	\N	staff	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	$2b$12$LQv3c1yqBWVHxkd0LQ1lqu.Y5qktJ8j1GrCJFhyH2mH8mO8L9Z8Fe
guest-001	guest@demo.com	Guest	User	\N	guest	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	$2b$12$LQv3c1yqBWVHxkd0LQ1lqu.Y5qktJ8j1GrCJFhyH2mH8mO8L9Z8Fe
staff-4	lisa.chen@demo.com	Lisa	Chen	\N	staff	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
retail-001	retail@demo.com	Retail	Agent	\N	retail-agent	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	123456
referral-001	referral@demo.com	Referral	Agent	\N	referral-agent	2025-07-05 18:23:42.134644	2025-07-05 18:23:42.134644	demo-org	t	\N	123456
demo-admin	admin@test.com	Admin	User	\N	admin	2025-07-02 12:13:51.083591	2025-07-25 03:47:32.639	default-org	t	\N	admin123
demo-pm	manager@test.com	Portfolio	Manager	\N	portfolio-manager	2025-07-02 12:13:51.196241	2025-07-25 03:47:33.209	default-org	t	\N	manager123
demo-owner	owner@test.com	Property	Owner	\N	owner	2025-07-02 12:13:51.229492	2025-07-25 03:47:33.305	default-org	t	\N	owner123
demo-staff	staff@test.com	Staff	Member	\N	staff	2025-07-02 12:13:51.263076	2025-07-25 03:47:33.34	default-org	t	\N	staff123
staff-cleaning	test_cleaning@example.com	Maria	Santos	\N	staff	2025-07-02 16:22:49.254956	2025-07-25 03:47:33.374	default-org	t	\N	test123
staff-pool	test_pool@example.com	John	Pool	\N	staff	2025-07-02 16:22:49.320103	2025-07-25 03:47:33.408	default-org	t	\N	test123
staff-garden	test_garden@example.com	Green	Thumb	\N	staff	2025-07-02 16:22:49.353219	2025-07-25 03:47:33.441	default-org	t	\N	test123
staff-maintenance	test_maintenance@example.com	Fix	All	\N	staff	2025-07-02 16:22:49.384341	2025-07-25 03:47:33.475	default-org	t	\N	test123
demo-agent	retail@demo.com	Test Retail	Agent	\N	retail-agent	2025-07-02 18:05:28.542763	2025-07-25 03:47:33.509	default-org	t	\N	123456
agent-1	david.taylor@realestate.com	David	Taylor	\N	retail-agent	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
agent-2	sophie.anderson@referrals.com	Sophie	Anderson	\N	referral-agent	2025-07-24 07:53:44.543373	2025-07-24 07:53:44.543373	default-org	t	\N	\N
\.


--
-- Data for Name: utility_bill_reminders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.utility_bill_reminders (id, organization_id, utility_bill_id, reminder_type, sent_at, sent_to, reminder_message, is_read, created_at) FROM stdin;
1	demo-org-1	7	overdue	2025-07-03 06:38:23.350844	demo-admin	Utility bill for internet is overdue. Amount: ฿659	f	2025-07-03 06:38:23.350844
2	demo-org-1	12	overdue	2025-07-03 06:38:23.387451	demo-admin	Utility bill for water is overdue. Amount: ฿541	f	2025-07-03 06:38:23.387451
3	demo-org-1	15	overdue	2025-07-03 06:38:23.419571	demo-admin	Utility bill for internet is overdue. Amount: ฿713	f	2025-07-03 06:38:23.419571
4	demo-org-1	1	due_soon	2025-07-03 06:38:23.4515	demo-admin	electricity bill is due soon. Expected on 2025-07-15	t	2025-07-03 06:38:23.4515
5	demo-org-1	3	due_soon	2025-07-03 06:38:23.483461	demo-admin	water bill is due soon. Expected on 2025-07-20	t	2025-07-03 06:38:23.483461
\.


--
-- Data for Name: utility_bills; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.utility_bills (id, property_id, type, provider, account_number, amount, due_date, bill_period_start, bill_period_end, status, receipt_url, reminder_sent, is_recurring, next_due_date, created_at, updated_at, organization_id, utility_account_id, currency, billing_month, receipt_filename, responsible_party, is_owner_billable, uploaded_by, uploaded_at, notes) FROM stdin;
1	1	electricity	PEA (Provincial Electricity Authority)	EA13982	928.00	2025-07-15	2025-06-01	2025-06-30	pending	\N	f	t	2025-08-15	2025-07-03 06:38:22.838762	2025-07-03 06:38:22.838762	demo-org-1	1	THB	2025-07	\N	company	t	\N	\N	electricity bill for 2025-07
2	1	electricity	PEA (Provincial Electricity Authority)	EA13982	989.00	2025-06-15	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:22.877637	2025-07-03 06:38:22.877637	demo-org-1	1	THB	2025-06	\N	owner	t	demo-admin	2025-06-16 08:35:03.518	electricity bill for 2025-06
3	1	water	Water Authority	WA15477	419.00	2025-07-20	2025-06-01	2025-06-30	pending	\N	f	t	2025-08-20	2025-07-03 06:38:22.910182	2025-07-03 06:38:22.910182	demo-org-1	2	THB	2025-07	\N	owner	t	\N	\N	water bill for 2025-07
4	1	water	Water Authority	WA15477	334.00	2025-06-20	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:22.942397	2025-07-03 06:38:22.942397	demo-org-1	2	THB	2025-06	\N	owner	t	demo-admin	2025-06-05 03:10:01.51	water bill for 2025-06
5	1	internet	AIS	INT14108	1010.00	2025-07-05	2025-06-01	2025-06-30	uploaded	\N	f	t	2025-08-05	2025-07-03 06:38:22.974951	2025-07-03 06:38:22.974951	demo-org-1	3	THB	2025-07	\N	owner	t	\N	\N	internet bill for 2025-07
6	1	internet	AIS	INT14108	967.00	2025-06-05	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:23.007101	2025-07-03 06:38:23.007101	demo-org-1	3	THB	2025-06	\N	owner	t	demo-admin	2025-06-15 13:48:17.416	internet bill for 2025-06
7	1	internet	AIS	INT14108	659.00	2025-06-23	2025-05-01	2025-05-31	overdue	\N	f	t	\N	2025-07-03 06:38:23.038303	2025-07-03 06:38:23.038303	demo-org-1	3	THB	2025-06	\N	owner	t	\N	\N	Overdue internet bill
8	2	electricity	PEA (Provincial Electricity Authority)	EA28230	1582.00	2025-07-15	2025-06-01	2025-06-30	uploaded	\N	f	t	2025-08-15	2025-07-03 06:38:23.070639	2025-07-03 06:38:23.070639	demo-org-1	4	THB	2025-07	\N	owner	t	\N	\N	electricity bill for 2025-07
9	2	electricity	PEA (Provincial Electricity Authority)	EA28230	2033.00	2025-06-15	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:23.103366	2025-07-03 06:38:23.103366	demo-org-1	4	THB	2025-06	\N	owner	t	demo-admin	2025-06-24 23:56:08.322	electricity bill for 2025-06
10	2	water	Water Authority	WA25827	536.00	2025-07-20	2025-06-01	2025-06-30	uploaded	\N	f	t	2025-08-20	2025-07-03 06:38:23.137397	2025-07-03 06:38:23.137397	demo-org-1	5	THB	2025-07	\N	owner	t	\N	\N	water bill for 2025-07
11	2	water	Water Authority	WA25827	415.00	2025-06-20	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:23.175397	2025-07-03 06:38:23.175397	demo-org-1	5	THB	2025-06	\N	company	t	demo-admin	2025-06-28 00:59:13.898	water bill for 2025-06
12	2	water	Water Authority	WA25827	541.00	2025-06-23	2025-05-01	2025-05-31	overdue	\N	f	t	\N	2025-07-03 06:38:23.207744	2025-07-03 06:38:23.207744	demo-org-1	5	THB	2025-06	\N	owner	t	\N	\N	Overdue water bill
13	2	internet	AIS	INT20406	666.00	2025-07-05	2025-06-01	2025-06-30	pending	\N	f	t	2025-08-05	2025-07-03 06:38:23.239315	2025-07-03 06:38:23.239315	demo-org-1	6	THB	2025-07	\N	owner	t	\N	\N	internet bill for 2025-07
14	2	internet	AIS	INT20406	648.00	2025-06-05	2025-05-01	2025-05-31	paid	\N	f	t	\N	2025-07-03 06:38:23.272037	2025-07-03 06:38:23.272037	demo-org-1	6	THB	2025-06	\N	owner	t	demo-admin	2025-06-12 12:27:08.519	internet bill for 2025-06
15	2	internet	AIS	INT20406	713.00	2025-06-23	2025-05-01	2025-05-31	overdue	\N	f	t	\N	2025-07-03 06:38:23.304547	2025-07-03 06:38:23.304547	demo-org-1	6	THB	2025-06	\N	owner	t	\N	\N	Overdue internet bill
\.


--
-- Data for Name: utility_providers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.utility_providers (id, organization_id, utility_type, provider_name, country, is_default, display_order, created_by, created_at, updated_at, region, is_active, contact_info, billing_cycle, notes) FROM stdin;
1	demo-org-1	internet	True Online	Thailand	t	1	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
2	demo-org-1	internet	3BB	Thailand	f	2	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
3	demo-org-1	internet	NT	Thailand	f	3	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
4	demo-org-1	internet	CAT	Thailand	f	4	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
5	demo-org-1	internet	TOT	Thailand	f	5	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
6	demo-org-1	internet	AIS	Thailand	f	6	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
7	demo-org-1	electricity	PEA	Thailand	t	1	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
8	demo-org-1	water	Government	Thailand	t	1	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
9	demo-org-1	water	Deepwell	Thailand	f	2	demo-admin	2025-07-02 17:17:40.545536	2025-07-02 17:17:40.545536	\N	t	\N	monthly	\N
10	default-org	internet	True Online	Thailand	t	1	system-seed	2025-07-02 18:00:23.741339	2025-07-02 18:00:23.741339	\N	t	\N	monthly	\N
11	default-org	internet	3BB	Thailand	f	2	system-seed	2025-07-02 18:00:23.780668	2025-07-02 18:00:23.780668	\N	t	\N	monthly	\N
12	default-org	internet	NT	Thailand	f	3	system-seed	2025-07-02 18:00:23.813141	2025-07-02 18:00:23.813141	\N	t	\N	monthly	\N
13	default-org	internet	CAT Telecom	Thailand	f	4	system-seed	2025-07-02 18:00:23.844972	2025-07-02 18:00:23.844972	\N	t	\N	monthly	\N
14	default-org	internet	TOT	Thailand	f	5	system-seed	2025-07-02 18:00:23.878428	2025-07-02 18:00:23.878428	\N	t	\N	monthly	\N
15	default-org	internet	AIS Fibre	Thailand	f	6	system-seed	2025-07-02 18:00:23.909965	2025-07-02 18:00:23.909965	\N	t	\N	monthly	\N
16	default-org	electricity	PEA (Provincial Electricity Authority)	Thailand	t	1	system-seed	2025-07-02 18:00:23.9422	2025-07-02 18:00:23.9422	\N	t	\N	monthly	\N
17	default-org	electricity	MEA (Metropolitan Electricity Authority)	Thailand	f	2	system-seed	2025-07-02 18:00:23.974637	2025-07-02 18:00:23.974637	\N	t	\N	monthly	\N
18	default-org	water	Deepwell	Thailand	t	1	system-seed	2025-07-02 18:00:24.007714	2025-07-02 18:00:24.007714	\N	t	\N	monthly	\N
19	default-org	water	Government Water	Thailand	f	2	system-seed	2025-07-02 18:00:24.039674	2025-07-02 18:00:24.039674	\N	t	\N	monthly	\N
20	default-org	water	Private Water Company	Thailand	f	3	system-seed	2025-07-02 18:00:24.071636	2025-07-02 18:00:24.071636	\N	t	\N	monthly	\N
21	default-org	gas	PTT LPG	Thailand	t	1	system-seed	2025-07-02 18:00:24.104041	2025-07-02 18:00:24.104041	\N	t	\N	monthly	\N
22	default-org	gas	Shell Gas	Thailand	f	2	system-seed	2025-07-02 18:00:24.136443	2025-07-02 18:00:24.136443	\N	t	\N	monthly	\N
23	default-org	gas	Unique Gas	Thailand	f	3	system-seed	2025-07-02 18:00:24.168594	2025-07-02 18:00:24.168594	\N	t	\N	monthly	\N
\.


--
-- Data for Name: vendor_service_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vendor_service_history (id, organization_id, vendor_id, service_id, property_id, completed_date, quality_score, timeliness_score, cost, notes, created_at) FROM stdin;
\.


--
-- Data for Name: welcome_pack_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welcome_pack_items (id, organization_id, name, category, unit_cost, currency, supplier, restock_threshold, current_stock, is_active, created_at, updated_at) FROM stdin;
1	demo-org	Water Bottle	beverages	2.50	AUD	Mountain Spring Water Co	20	50	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
2	demo-org	Soap Bar	toiletries	3.75	AUD	Luxury Bath Supplies	15	30	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
3	demo-org	Coffee Pods	beverages	1.25	AUD	Premium Coffee Co	25	100	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
4	demo-org	Shampoo	toiletries	4.50	AUD	Organic Care Products	10	25	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
5	demo-org	Welcome Note	amenities	0.50	AUD	Local Print Shop	50	150	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
6	demo-org	Chocolate	snacks	5.00	AUD	Artisan Confectionery	20	40	t	2025-07-02 07:58:54.034334	2025-07-02 07:58:54.034334
\.


--
-- Data for Name: welcome_pack_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welcome_pack_templates (id, organization_id, property_id, item_id, default_quantity, is_complimentary, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: welcome_pack_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welcome_pack_usage (id, organization_id, property_id, booking_id, item_id, quantity_used, unit_cost, total_cost, billing_option, processed_by, usage_date, notes, created_at, updated_at) FROM stdin;
\.


--
-- Name: addon_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.addon_bookings_id_seq', 1, false);


--
-- Name: addon_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.addon_services_id_seq', 91, true);


--
-- Name: agent_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.agent_bookings_id_seq', 1, false);


--
-- Name: agent_media_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.agent_media_access_id_seq', 1, false);


--
-- Name: agent_payouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.agent_payouts_id_seq', 1, false);


--
-- Name: ai_configuration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_configuration_id_seq', 1, false);


--
-- Name: ai_generated_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_generated_tasks_id_seq', 1, false);


--
-- Name: ai_media_suggestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_media_suggestions_id_seq', 1, false);


--
-- Name: ai_task_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_task_rules_id_seq', 16, true);


--
-- Name: booking_cost_breakdowns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.booking_cost_breakdowns_id_seq', 1, false);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- Name: commission_earnings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.commission_earnings_id_seq', 1, false);


--
-- Name: commission_invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.commission_invoice_items_id_seq', 1, false);


--
-- Name: commission_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.commission_invoices_id_seq', 1, false);


--
-- Name: commission_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.commission_log_id_seq', 7, true);


--
-- Name: custom_expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.custom_expense_categories_id_seq', 5, true);


--
-- Name: feedback_processing_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.feedback_processing_log_id_seq', 1, false);


--
-- Name: finances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.finances_id_seq', 81, true);


--
-- Name: financial_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.financial_transactions_id_seq', 1, false);


--
-- Name: guest_activity_timeline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_activity_timeline_id_seq', 1, false);


--
-- Name: guest_addon_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_addon_bookings_id_seq', 4, true);


--
-- Name: guest_addon_service_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_addon_service_requests_id_seq', 1, false);


--
-- Name: guest_addon_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_addon_services_id_seq', 10, true);


--
-- Name: guest_ai_faq_knowledge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_ai_faq_knowledge_id_seq', 1, false);


--
-- Name: guest_chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_chat_messages_id_seq', 1, false);


--
-- Name: guest_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_feedback_id_seq', 1, false);


--
-- Name: guest_maintenance_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_maintenance_reports_id_seq', 1, false);


--
-- Name: guest_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_messages_id_seq', 1, false);


--
-- Name: guest_portal_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_portal_access_id_seq', 1, false);


--
-- Name: guest_portal_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_portal_sessions_id_seq', 1, false);


--
-- Name: guest_property_local_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_property_local_info_id_seq', 1, false);


--
-- Name: guest_service_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guest_service_requests_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- Name: invoice_line_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invoice_line_items_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: maintenance_approval_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_approval_logs_id_seq', 1, false);


--
-- Name: maintenance_suggestion_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_suggestion_settings_id_seq', 1, false);


--
-- Name: maintenance_suggestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_suggestions_id_seq', 1, false);


--
-- Name: maintenance_timeline_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_timeline_entries_id_seq', 1, false);


--
-- Name: marketplace_service_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.marketplace_service_analytics_id_seq', 1, false);


--
-- Name: marketplace_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.marketplace_services_id_seq', 1, false);


--
-- Name: media_folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.media_folders_id_seq', 1, false);


--
-- Name: media_usage_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.media_usage_analytics_id_seq', 1, false);


--
-- Name: notification_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notification_preferences_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: onboarding_step_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.onboarding_step_details_id_seq', 1, false);


--
-- Name: organization_api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.organization_api_keys_id_seq', 1, false);


--
-- Name: owner_activity_timeline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_activity_timeline_id_seq', 1, false);


--
-- Name: owner_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_balances_id_seq', 1, false);


--
-- Name: owner_charge_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_charge_requests_id_seq', 1, false);


--
-- Name: owner_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_documents_id_seq', 1, false);


--
-- Name: owner_financial_summary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_financial_summary_id_seq', 1, false);


--
-- Name: owner_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_invoices_id_seq', 1, false);


--
-- Name: owner_onboarding_processes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_onboarding_processes_id_seq', 1, false);


--
-- Name: owner_payout_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_payout_requests_id_seq', 3, true);


--
-- Name: owner_payouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_payouts_id_seq', 1, false);


--
-- Name: owner_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_preferences_id_seq', 1, false);


--
-- Name: owner_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_settings_id_seq', 1, true);


--
-- Name: owner_timeline_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.owner_timeline_activity_id_seq', 10, true);


--
-- Name: platform_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.platform_settings_id_seq', 1, false);


--
-- Name: pm_commission_balance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pm_commission_balance_id_seq', 1, true);


--
-- Name: pm_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pm_notifications_id_seq', 4, true);


--
-- Name: pm_payout_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pm_payout_requests_id_seq', 2, true);


--
-- Name: pm_property_performance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pm_property_performance_id_seq', 1, false);


--
-- Name: pm_task_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pm_task_logs_id_seq', 2, true);


--
-- Name: portfolio_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.portfolio_assignments_id_seq', 2, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.properties_id_seq', 17, true);


--
-- Name: property_agents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_agents_id_seq', 1, false);


--
-- Name: property_custom_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_custom_expenses_id_seq', 1, false);


--
-- Name: property_media_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_media_files_id_seq', 1, false);


--
-- Name: property_media_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_media_settings_id_seq', 1, false);


--
-- Name: property_payout_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_payout_rules_id_seq', 1, false);


--
-- Name: property_referrals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_referrals_id_seq', 1, false);


--
-- Name: property_revenue_targets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_revenue_targets_id_seq', 1, false);


--
-- Name: property_utility_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_utility_accounts_id_seq', 6, true);


--
-- Name: property_utility_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.property_utility_settings_id_seq', 1, false);


--
-- Name: recurring_service_charges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.recurring_service_charges_id_seq', 1, false);


--
-- Name: referral_earnings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.referral_earnings_id_seq', 1, false);


--
-- Name: service_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_bookings_id_seq', 1, false);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 68, true);


--
-- Name: service_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_reviews_id_seq', 1, false);


--
-- Name: service_vendor_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_vendor_analytics_id_seq', 1, false);


--
-- Name: service_vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_vendors_id_seq', 6, true);


--
-- Name: staff_salaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.staff_salaries_id_seq', 1, false);


--
-- Name: task_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.task_history_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tasks_id_seq', 102, true);


--
-- Name: utility_bill_reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.utility_bill_reminders_id_seq', 5, true);


--
-- Name: utility_bills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.utility_bills_id_seq', 15, true);


--
-- Name: utility_providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.utility_providers_id_seq', 23, true);


--
-- Name: vendor_service_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.vendor_service_history_id_seq', 1, false);


--
-- Name: welcome_pack_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welcome_pack_items_id_seq', 6, true);


--
-- Name: welcome_pack_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welcome_pack_templates_id_seq', 1, false);


--
-- Name: welcome_pack_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welcome_pack_usage_id_seq', 1, false);


--
-- Name: addon_bookings addon_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_pkey PRIMARY KEY (id);


--
-- Name: addon_services addon_services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_services
    ADD CONSTRAINT addon_services_pkey PRIMARY KEY (id);


--
-- Name: agent_bookings agent_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings
    ADD CONSTRAINT agent_bookings_pkey PRIMARY KEY (id);


--
-- Name: agent_media_access agent_media_access_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_media_access
    ADD CONSTRAINT agent_media_access_pkey PRIMARY KEY (id);


--
-- Name: agent_payouts agent_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_payouts
    ADD CONSTRAINT agent_payouts_pkey PRIMARY KEY (id);


--
-- Name: ai_configuration ai_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_configuration
    ADD CONSTRAINT ai_configuration_pkey PRIMARY KEY (id);


--
-- Name: ai_generated_tasks ai_generated_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_generated_tasks
    ADD CONSTRAINT ai_generated_tasks_pkey PRIMARY KEY (id);


--
-- Name: ai_media_suggestions ai_media_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_media_suggestions
    ADD CONSTRAINT ai_media_suggestions_pkey PRIMARY KEY (id);


--
-- Name: ai_task_rules ai_task_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_task_rules
    ADD CONSTRAINT ai_task_rules_pkey PRIMARY KEY (id);


--
-- Name: booking_cost_breakdowns booking_cost_breakdowns_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.booking_cost_breakdowns
    ADD CONSTRAINT booking_cost_breakdowns_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_booking_reference_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: commission_earnings commission_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_earnings
    ADD CONSTRAINT commission_earnings_pkey PRIMARY KEY (id);


--
-- Name: commission_invoice_items commission_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoice_items
    ADD CONSTRAINT commission_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: commission_invoices commission_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoices
    ADD CONSTRAINT commission_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: commission_invoices commission_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoices
    ADD CONSTRAINT commission_invoices_pkey PRIMARY KEY (id);


--
-- Name: commission_log commission_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_log
    ADD CONSTRAINT commission_log_pkey PRIMARY KEY (id);


--
-- Name: custom_expense_categories custom_expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_expense_categories
    ADD CONSTRAINT custom_expense_categories_pkey PRIMARY KEY (id);


--
-- Name: feedback_processing_log feedback_processing_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_pkey PRIMARY KEY (id);


--
-- Name: finances finances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_pkey PRIMARY KEY (id);


--
-- Name: financial_transactions financial_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_transactions
    ADD CONSTRAINT financial_transactions_pkey PRIMARY KEY (id);


--
-- Name: guest_activity_timeline guest_activity_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_activity_timeline
    ADD CONSTRAINT guest_activity_timeline_pkey PRIMARY KEY (id);


--
-- Name: guest_addon_bookings guest_addon_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_bookings
    ADD CONSTRAINT guest_addon_bookings_pkey PRIMARY KEY (id);


--
-- Name: guest_addon_service_requests guest_addon_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_service_requests
    ADD CONSTRAINT guest_addon_service_requests_pkey PRIMARY KEY (id);


--
-- Name: guest_addon_services guest_addon_services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_services
    ADD CONSTRAINT guest_addon_services_pkey PRIMARY KEY (id);


--
-- Name: guest_ai_faq_knowledge guest_ai_faq_knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_ai_faq_knowledge
    ADD CONSTRAINT guest_ai_faq_knowledge_pkey PRIMARY KEY (id);


--
-- Name: guest_chat_messages guest_chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_chat_messages
    ADD CONSTRAINT guest_chat_messages_pkey PRIMARY KEY (id);


--
-- Name: guest_feedback guest_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_feedback
    ADD CONSTRAINT guest_feedback_pkey PRIMARY KEY (id);


--
-- Name: guest_maintenance_reports guest_maintenance_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_maintenance_reports
    ADD CONSTRAINT guest_maintenance_reports_pkey PRIMARY KEY (id);


--
-- Name: guest_messages guest_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_messages
    ADD CONSTRAINT guest_messages_pkey PRIMARY KEY (id);


--
-- Name: guest_portal_access guest_portal_access_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_access
    ADD CONSTRAINT guest_portal_access_pkey PRIMARY KEY (id);


--
-- Name: guest_portal_sessions guest_portal_sessions_access_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_sessions
    ADD CONSTRAINT guest_portal_sessions_access_token_key UNIQUE (access_token);


--
-- Name: guest_portal_sessions guest_portal_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_sessions
    ADD CONSTRAINT guest_portal_sessions_pkey PRIMARY KEY (id);


--
-- Name: guest_property_local_info guest_property_local_info_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_property_local_info
    ADD CONSTRAINT guest_property_local_info_pkey PRIMARY KEY (id);


--
-- Name: guest_service_requests guest_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_service_requests
    ADD CONSTRAINT guest_service_requests_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: invoice_line_items invoice_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoice_line_items
    ADD CONSTRAINT invoice_line_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: maintenance_approval_logs maintenance_approval_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_approval_logs
    ADD CONSTRAINT maintenance_approval_logs_pkey PRIMARY KEY (id);


--
-- Name: maintenance_suggestion_settings maintenance_suggestion_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_suggestion_settings
    ADD CONSTRAINT maintenance_suggestion_settings_pkey PRIMARY KEY (id);


--
-- Name: maintenance_suggestions maintenance_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_suggestions
    ADD CONSTRAINT maintenance_suggestions_pkey PRIMARY KEY (id);


--
-- Name: maintenance_timeline_entries maintenance_timeline_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_timeline_entries
    ADD CONSTRAINT maintenance_timeline_entries_pkey PRIMARY KEY (id);


--
-- Name: marketplace_service_analytics marketplace_service_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_service_analytics
    ADD CONSTRAINT marketplace_service_analytics_pkey PRIMARY KEY (id);


--
-- Name: marketplace_services marketplace_services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_services
    ADD CONSTRAINT marketplace_services_pkey PRIMARY KEY (id);


--
-- Name: media_folders media_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.media_folders
    ADD CONSTRAINT media_folders_pkey PRIMARY KEY (id);


--
-- Name: media_usage_analytics media_usage_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.media_usage_analytics
    ADD CONSTRAINT media_usage_analytics_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: onboarding_step_details onboarding_step_details_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_step_details
    ADD CONSTRAINT onboarding_step_details_pkey PRIMARY KEY (id);


--
-- Name: organization_api_keys organization_api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_api_keys
    ADD CONSTRAINT organization_api_keys_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_domain_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_domain_unique UNIQUE (domain);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_subdomain_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_subdomain_unique UNIQUE (subdomain);


--
-- Name: owner_activity_timeline owner_activity_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline
    ADD CONSTRAINT owner_activity_timeline_pkey PRIMARY KEY (id);


--
-- Name: owner_balances owner_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_balances
    ADD CONSTRAINT owner_balances_pkey PRIMARY KEY (id);


--
-- Name: owner_charge_requests owner_charge_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_charge_requests
    ADD CONSTRAINT owner_charge_requests_pkey PRIMARY KEY (id);


--
-- Name: owner_documents owner_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_pkey PRIMARY KEY (id);


--
-- Name: owner_financial_summary owner_financial_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_financial_summary
    ADD CONSTRAINT owner_financial_summary_pkey PRIMARY KEY (id);


--
-- Name: owner_invoices owner_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: owner_invoices owner_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_pkey PRIMARY KEY (id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_pkey PRIMARY KEY (id);


--
-- Name: owner_payout_requests owner_payout_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_pkey PRIMARY KEY (id);


--
-- Name: owner_payouts owner_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payouts
    ADD CONSTRAINT owner_payouts_pkey PRIMARY KEY (id);


--
-- Name: owner_preferences owner_preferences_owner_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_preferences
    ADD CONSTRAINT owner_preferences_owner_id_key UNIQUE (owner_id);


--
-- Name: owner_preferences owner_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_preferences
    ADD CONSTRAINT owner_preferences_pkey PRIMARY KEY (id);


--
-- Name: owner_settings owner_settings_owner_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_settings
    ADD CONSTRAINT owner_settings_owner_id_key UNIQUE (owner_id);


--
-- Name: owner_settings owner_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_settings
    ADD CONSTRAINT owner_settings_pkey PRIMARY KEY (id);


--
-- Name: owner_timeline_activity owner_timeline_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_timeline_activity
    ADD CONSTRAINT owner_timeline_activity_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_setting_key_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_setting_key_unique UNIQUE (setting_key);


--
-- Name: pm_commission_balance pm_commission_balance_organization_id_manager_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_commission_balance
    ADD CONSTRAINT pm_commission_balance_organization_id_manager_id_key UNIQUE (organization_id, manager_id);


--
-- Name: pm_commission_balance pm_commission_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_commission_balance
    ADD CONSTRAINT pm_commission_balance_pkey PRIMARY KEY (id);


--
-- Name: pm_notifications pm_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_notifications
    ADD CONSTRAINT pm_notifications_pkey PRIMARY KEY (id);


--
-- Name: pm_payout_requests pm_payout_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_payout_requests
    ADD CONSTRAINT pm_payout_requests_pkey PRIMARY KEY (id);


--
-- Name: pm_property_performance pm_property_performance_organization_id_manager_id_property_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_property_performance
    ADD CONSTRAINT pm_property_performance_organization_id_manager_id_property_key UNIQUE (organization_id, manager_id, property_id, period);


--
-- Name: pm_property_performance pm_property_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_property_performance
    ADD CONSTRAINT pm_property_performance_pkey PRIMARY KEY (id);


--
-- Name: pm_task_logs pm_task_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pm_task_logs
    ADD CONSTRAINT pm_task_logs_pkey PRIMARY KEY (id);


--
-- Name: portfolio_assignments portfolio_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_assignments
    ADD CONSTRAINT portfolio_assignments_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_agents property_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_agents
    ADD CONSTRAINT property_agents_pkey PRIMARY KEY (id);


--
-- Name: property_custom_expenses property_custom_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_custom_expenses
    ADD CONSTRAINT property_custom_expenses_pkey PRIMARY KEY (id);


--
-- Name: property_media_files property_media_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_media_files
    ADD CONSTRAINT property_media_files_pkey PRIMARY KEY (id);


--
-- Name: property_media_settings property_media_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_media_settings
    ADD CONSTRAINT property_media_settings_pkey PRIMARY KEY (id);


--
-- Name: property_payout_rules property_payout_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_payout_rules
    ADD CONSTRAINT property_payout_rules_pkey PRIMARY KEY (id);


--
-- Name: property_referrals property_referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_referrals
    ADD CONSTRAINT property_referrals_pkey PRIMARY KEY (id);


--
-- Name: property_revenue_targets property_revenue_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_revenue_targets
    ADD CONSTRAINT property_revenue_targets_pkey PRIMARY KEY (id);


--
-- Name: property_utility_accounts property_utility_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_accounts
    ADD CONSTRAINT property_utility_accounts_pkey PRIMARY KEY (id);


--
-- Name: property_utility_settings property_utility_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_settings
    ADD CONSTRAINT property_utility_settings_pkey PRIMARY KEY (id);


--
-- Name: recurring_service_charges recurring_service_charges_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recurring_service_charges
    ADD CONSTRAINT recurring_service_charges_pkey PRIMARY KEY (id);


--
-- Name: referral_earnings referral_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT referral_earnings_pkey PRIMARY KEY (id);


--
-- Name: service_bookings service_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_reviews service_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_pkey PRIMARY KEY (id);


--
-- Name: service_vendor_analytics service_vendor_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendor_analytics
    ADD CONSTRAINT service_vendor_analytics_pkey PRIMARY KEY (id);


--
-- Name: service_vendors service_vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendors
    ADD CONSTRAINT service_vendors_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: staff_salaries staff_salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.staff_salaries
    ADD CONSTRAINT staff_salaries_pkey PRIMARY KEY (id);


--
-- Name: task_history task_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: utility_bill_reminders utility_bill_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bill_reminders
    ADD CONSTRAINT utility_bill_reminders_pkey PRIMARY KEY (id);


--
-- Name: utility_bills utility_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bills
    ADD CONSTRAINT utility_bills_pkey PRIMARY KEY (id);


--
-- Name: utility_providers utility_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_providers
    ADD CONSTRAINT utility_providers_pkey PRIMARY KEY (id);


--
-- Name: vendor_service_history vendor_service_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history
    ADD CONSTRAINT vendor_service_history_pkey PRIMARY KEY (id);


--
-- Name: welcome_pack_items welcome_pack_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_items
    ADD CONSTRAINT welcome_pack_items_pkey PRIMARY KEY (id);


--
-- Name: welcome_pack_templates welcome_pack_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_templates
    ADD CONSTRAINT welcome_pack_templates_pkey PRIMARY KEY (id);


--
-- Name: welcome_pack_usage welcome_pack_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_usage
    ADD CONSTRAINT welcome_pack_usage_pkey PRIMARY KEY (id);


--
-- Name: IDX_api_key_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_api_key_org" ON public.organization_api_keys USING btree (organization_id);


--
-- Name: IDX_api_key_provider; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_api_key_provider" ON public.organization_api_keys USING btree (provider);


--
-- Name: IDX_property_external; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_property_external" ON public.properties USING btree (external_id);


--
-- Name: IDX_property_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_property_org" ON public.properties USING btree (organization_id);


--
-- Name: IDX_property_owner; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_property_owner" ON public.properties USING btree (owner_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: IDX_session_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_org" ON public.sessions USING btree (organization_id);


--
-- Name: IDX_task_history_property; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_task_history_property" ON public.task_history USING btree (property_id);


--
-- Name: IDX_task_history_task; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_task_history_task" ON public.task_history USING btree (task_id);


--
-- Name: IDX_task_history_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_task_history_user" ON public.task_history USING btree (performed_by);


--
-- Name: IDX_user_email_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_user_email_org" ON public.users USING btree (email, organization_id);


--
-- Name: IDX_user_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_user_org" ON public.users USING btree (organization_id);


--
-- Name: idx_commission_invoice_items_invoice; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_invoice_items_invoice ON public.commission_invoice_items USING btree (invoice_id);


--
-- Name: idx_commission_invoice_items_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_invoice_items_org ON public.commission_invoice_items USING btree (organization_id);


--
-- Name: idx_commission_invoices_agent; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_invoices_agent ON public.commission_invoices USING btree (agent_id, agent_type);


--
-- Name: idx_commission_invoices_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_invoices_org ON public.commission_invoices USING btree (organization_id);


--
-- Name: idx_commission_invoices_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_invoices_status ON public.commission_invoices USING btree (status);


--
-- Name: idx_commission_log_agent; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_log_agent ON public.commission_log USING btree (agent_id, agent_type);


--
-- Name: idx_commission_log_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_log_created ON public.commission_log USING btree (created_at);


--
-- Name: idx_commission_log_org; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_log_org ON public.commission_log USING btree (organization_id);


--
-- Name: idx_commission_log_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_commission_log_status ON public.commission_log USING btree (status);


--
-- Name: idx_owner_financial_summary_owner_period; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_owner_financial_summary_owner_period ON public.owner_financial_summary USING btree (organization_id, owner_id, period_start, period_end);


--
-- Name: idx_owner_payout_requests_owner_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_owner_payout_requests_owner_status ON public.owner_payout_requests USING btree (organization_id, owner_id, status);


--
-- Name: idx_owner_settings_owner; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_owner_settings_owner ON public.owner_settings USING btree (organization_id, owner_id);


--
-- Name: idx_owner_timeline_activity_owner_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_owner_timeline_activity_owner_date ON public.owner_timeline_activity USING btree (organization_id, owner_id, created_at DESC);


--
-- Name: idx_pm_commission_balance_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_pm_commission_balance_org_manager ON public.pm_commission_balance USING btree (organization_id, manager_id);


--
-- Name: idx_pm_notifications_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_pm_notifications_org_manager ON public.pm_notifications USING btree (organization_id, manager_id);


--
-- Name: idx_pm_payout_requests_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_pm_payout_requests_org_manager ON public.pm_payout_requests USING btree (organization_id, manager_id);


--
-- Name: idx_pm_property_performance_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_pm_property_performance_org_manager ON public.pm_property_performance USING btree (organization_id, manager_id);


--
-- Name: idx_pm_task_logs_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_pm_task_logs_org_manager ON public.pm_task_logs USING btree (organization_id, manager_id);


--
-- Name: idx_portfolio_assignments_org_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_portfolio_assignments_org_manager ON public.portfolio_assignments USING btree (organization_id, manager_id);


--
-- Name: idx_portfolio_assignments_property; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_portfolio_assignments_property ON public.portfolio_assignments USING btree (property_id, is_active);


--
-- Name: addon_bookings addon_bookings_approved_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_approved_by_users_id_fk FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: addon_bookings addon_bookings_booked_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_booked_by_users_id_fk FOREIGN KEY (booked_by) REFERENCES public.users(id);


--
-- Name: addon_bookings addon_bookings_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: addon_bookings addon_bookings_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: addon_bookings addon_bookings_service_id_addon_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addon_bookings
    ADD CONSTRAINT addon_bookings_service_id_addon_services_id_fk FOREIGN KEY (service_id) REFERENCES public.addon_services(id);


--
-- Name: agent_bookings agent_bookings_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings
    ADD CONSTRAINT agent_bookings_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: agent_bookings agent_bookings_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings
    ADD CONSTRAINT agent_bookings_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: agent_bookings agent_bookings_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings
    ADD CONSTRAINT agent_bookings_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: agent_bookings agent_bookings_retail_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_bookings
    ADD CONSTRAINT agent_bookings_retail_agent_id_users_id_fk FOREIGN KEY (retail_agent_id) REFERENCES public.users(id);


--
-- Name: agent_payouts agent_payouts_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_payouts
    ADD CONSTRAINT agent_payouts_agent_id_users_id_fk FOREIGN KEY (agent_id) REFERENCES public.users(id);


--
-- Name: agent_payouts agent_payouts_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_payouts
    ADD CONSTRAINT agent_payouts_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: agent_payouts agent_payouts_processed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.agent_payouts
    ADD CONSTRAINT agent_payouts_processed_by_users_id_fk FOREIGN KEY (processed_by) REFERENCES public.users(id);


--
-- Name: ai_configuration ai_configuration_last_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_configuration
    ADD CONSTRAINT ai_configuration_last_updated_by_users_id_fk FOREIGN KEY (last_updated_by) REFERENCES public.users(id);


--
-- Name: ai_configuration ai_configuration_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_configuration
    ADD CONSTRAINT ai_configuration_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: ai_generated_tasks ai_generated_tasks_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_generated_tasks
    ADD CONSTRAINT ai_generated_tasks_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.guest_messages(id);


--
-- Name: ai_task_rules ai_task_rules_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_task_rules
    ADD CONSTRAINT ai_task_rules_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: ai_task_rules ai_task_rules_default_assignee_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_task_rules
    ADD CONSTRAINT ai_task_rules_default_assignee_users_id_fk FOREIGN KEY (default_assignee) REFERENCES public.users(id);


--
-- Name: ai_task_rules ai_task_rules_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_task_rules
    ADD CONSTRAINT ai_task_rules_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: booking_cost_breakdowns booking_cost_breakdowns_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.booking_cost_breakdowns
    ADD CONSTRAINT booking_cost_breakdowns_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id);


--
-- Name: booking_cost_breakdowns booking_cost_breakdowns_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.booking_cost_breakdowns
    ADD CONSTRAINT booking_cost_breakdowns_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: bookings bookings_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: bookings bookings_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: commission_invoice_items commission_invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.commission_invoice_items
    ADD CONSTRAINT commission_invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.commission_invoices(id) ON DELETE CASCADE;


--
-- Name: feedback_processing_log feedback_processing_log_created_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_created_task_id_tasks_id_fk FOREIGN KEY (created_task_id) REFERENCES public.tasks(id);


--
-- Name: feedback_processing_log feedback_processing_log_feedback_id_guest_feedback_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_feedback_id_guest_feedback_id_fk FOREIGN KEY (feedback_id) REFERENCES public.guest_feedback(id);


--
-- Name: feedback_processing_log feedback_processing_log_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: feedback_processing_log feedback_processing_log_processed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_processed_by_users_id_fk FOREIGN KEY (processed_by) REFERENCES public.users(id);


--
-- Name: feedback_processing_log feedback_processing_log_triggered_rule_id_ai_task_rules_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feedback_processing_log
    ADD CONSTRAINT feedback_processing_log_triggered_rule_id_ai_task_rules_id_fk FOREIGN KEY (triggered_rule_id) REFERENCES public.ai_task_rules(id);


--
-- Name: finances finances_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_agent_id_users_id_fk FOREIGN KEY (agent_id) REFERENCES public.users(id);


--
-- Name: finances finances_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: finances finances_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: finances finances_processed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_processed_by_users_id_fk FOREIGN KEY (processed_by) REFERENCES public.users(id);


--
-- Name: finances finances_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT finances_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: guest_addon_bookings guest_addon_bookings_cancelled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_addon_bookings
    ADD CONSTRAINT guest_addon_bookings_cancelled_by_fkey FOREIGN KEY (cancelled_by) REFERENCES public.users(id);


--
-- Name: guest_portal_access guest_portal_access_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guest_portal_access
    ADD CONSTRAINT guest_portal_access_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: inventory inventory_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: invoice_line_items invoice_line_items_invoice_id_invoices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoice_line_items
    ADD CONSTRAINT invoice_line_items_invoice_id_invoices_id_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: marketplace_service_analytics marketplace_service_analytics_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_service_analytics
    ADD CONSTRAINT marketplace_service_analytics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: marketplace_service_analytics marketplace_service_analytics_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_service_analytics
    ADD CONSTRAINT marketplace_service_analytics_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: marketplace_service_analytics marketplace_service_analytics_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_service_analytics
    ADD CONSTRAINT marketplace_service_analytics_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.marketplace_services(id);


--
-- Name: marketplace_services marketplace_services_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_services
    ADD CONSTRAINT marketplace_services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);


--
-- Name: marketplace_services marketplace_services_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketplace_services
    ADD CONSTRAINT marketplace_services_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: notification_preferences notification_preferences_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: onboarding_step_details onboarding_step_details_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_step_details
    ADD CONSTRAINT onboarding_step_details_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.users(id);


--
-- Name: onboarding_step_details onboarding_step_details_onboarding_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_step_details
    ADD CONSTRAINT onboarding_step_details_onboarding_id_fkey FOREIGN KEY (onboarding_id) REFERENCES public.owner_onboarding_processes(id);


--
-- Name: onboarding_step_details onboarding_step_details_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_step_details
    ADD CONSTRAINT onboarding_step_details_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: organization_api_keys organization_api_keys_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_api_keys
    ADD CONSTRAINT organization_api_keys_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_activity_timeline owner_activity_timeline_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline
    ADD CONSTRAINT owner_activity_timeline_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: owner_activity_timeline owner_activity_timeline_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline
    ADD CONSTRAINT owner_activity_timeline_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_activity_timeline owner_activity_timeline_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline
    ADD CONSTRAINT owner_activity_timeline_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_activity_timeline owner_activity_timeline_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_activity_timeline
    ADD CONSTRAINT owner_activity_timeline_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: owner_balances owner_balances_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_balances
    ADD CONSTRAINT owner_balances_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_charge_requests owner_charge_requests_charged_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_charge_requests
    ADD CONSTRAINT owner_charge_requests_charged_by_fkey FOREIGN KEY (charged_by) REFERENCES public.users(id);


--
-- Name: owner_charge_requests owner_charge_requests_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_charge_requests
    ADD CONSTRAINT owner_charge_requests_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_documents owner_documents_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_documents owner_documents_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_documents owner_documents_process_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_process_id_fkey FOREIGN KEY (process_id) REFERENCES public.owner_onboarding_processes(id);


--
-- Name: owner_documents owner_documents_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: owner_documents owner_documents_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: owner_documents owner_documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_documents
    ADD CONSTRAINT owner_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: owner_financial_summary owner_financial_summary_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_financial_summary
    ADD CONSTRAINT owner_financial_summary_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: owner_invoices owner_invoices_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: owner_invoices owner_invoices_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_invoices owner_invoices_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_invoices owner_invoices_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_invoices
    ADD CONSTRAINT owner_invoices_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_deadline_set_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_deadline_set_by_fkey FOREIGN KEY (deadline_set_by) REFERENCES public.users(id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_last_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_last_updated_by_fkey FOREIGN KEY (last_updated_by) REFERENCES public.users(id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_onboarding_processes owner_onboarding_processes_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_onboarding_processes
    ADD CONSTRAINT owner_onboarding_processes_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: owner_payout_requests owner_payout_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: owner_payout_requests owner_payout_requests_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.users(id);


--
-- Name: owner_payout_requests owner_payout_requests_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_payout_requests owner_payout_requests_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_payout_requests owner_payout_requests_payment_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_payout_requests
    ADD CONSTRAINT owner_payout_requests_payment_uploaded_by_fkey FOREIGN KEY (payment_uploaded_by) REFERENCES public.users(id);


--
-- Name: owner_preferences owner_preferences_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_preferences
    ADD CONSTRAINT owner_preferences_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: owner_preferences owner_preferences_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_preferences
    ADD CONSTRAINT owner_preferences_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: owner_timeline_activity owner_timeline_activity_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.owner_timeline_activity
    ADD CONSTRAINT owner_timeline_activity_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: platform_settings platform_settings_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: portfolio_assignments portfolio_assignments_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.portfolio_assignments
    ADD CONSTRAINT portfolio_assignments_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: properties properties_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: properties properties_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: property_agents property_agents_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_agents
    ADD CONSTRAINT property_agents_agent_id_users_id_fk FOREIGN KEY (agent_id) REFERENCES public.users(id);


--
-- Name: property_agents property_agents_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_agents
    ADD CONSTRAINT property_agents_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: property_agents property_agents_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_agents
    ADD CONSTRAINT property_agents_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: property_custom_expenses property_custom_expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_custom_expenses
    ADD CONSTRAINT property_custom_expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.custom_expense_categories(id);


--
-- Name: property_payout_rules property_payout_rules_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_payout_rules
    ADD CONSTRAINT property_payout_rules_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_referrals property_referrals_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_referrals
    ADD CONSTRAINT property_referrals_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: property_referrals property_referrals_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_referrals
    ADD CONSTRAINT property_referrals_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: property_referrals property_referrals_referral_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_referrals
    ADD CONSTRAINT property_referrals_referral_agent_id_users_id_fk FOREIGN KEY (referral_agent_id) REFERENCES public.users(id);


--
-- Name: property_utility_accounts property_utility_accounts_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_accounts
    ADD CONSTRAINT property_utility_accounts_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_utility_settings property_utility_settings_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.property_utility_settings
    ADD CONSTRAINT property_utility_settings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.utility_providers(id);


--
-- Name: recurring_service_charges recurring_service_charges_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.recurring_service_charges
    ADD CONSTRAINT recurring_service_charges_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: referral_earnings referral_earnings_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT referral_earnings_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: referral_earnings referral_earnings_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT referral_earnings_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: referral_earnings referral_earnings_referral_agent_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT referral_earnings_referral_agent_id_users_id_fk FOREIGN KEY (referral_agent_id) REFERENCES public.users(id);


--
-- Name: service_bookings service_bookings_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: service_bookings service_bookings_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: service_bookings service_bookings_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.marketplace_services(id);


--
-- Name: service_categories service_categories_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: service_reviews service_reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id);


--
-- Name: service_reviews service_reviews_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: service_reviews service_reviews_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.marketplace_services(id);


--
-- Name: service_reviews service_reviews_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.service_vendors(id);


--
-- Name: service_vendor_analytics service_vendor_analytics_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendor_analytics
    ADD CONSTRAINT service_vendor_analytics_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: service_vendor_analytics service_vendor_analytics_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendor_analytics
    ADD CONSTRAINT service_vendor_analytics_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.service_vendors(id);


--
-- Name: service_vendors service_vendors_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_vendors
    ADD CONSTRAINT service_vendors_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: sessions sessions_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: task_history task_history_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: task_history task_history_performed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_performed_by_users_id_fk FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- Name: task_history task_history_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: task_history task_history_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: tasks tasks_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: tasks tasks_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: tasks tasks_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: tasks tasks_parent_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_parent_task_id_tasks_id_fk FOREIGN KEY (parent_task_id) REFERENCES public.tasks(id);


--
-- Name: tasks tasks_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: users users_organization_id_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: utility_bill_reminders utility_bill_reminders_utility_bill_id_utility_bills_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bill_reminders
    ADD CONSTRAINT utility_bill_reminders_utility_bill_id_utility_bills_id_fk FOREIGN KEY (utility_bill_id) REFERENCES public.utility_bills(id) ON DELETE CASCADE;


--
-- Name: utility_bills utility_bills_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bills
    ADD CONSTRAINT utility_bills_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: utility_bills utility_bills_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.utility_bills
    ADD CONSTRAINT utility_bills_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: vendor_service_history vendor_service_history_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history
    ADD CONSTRAINT vendor_service_history_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: vendor_service_history vendor_service_history_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history
    ADD CONSTRAINT vendor_service_history_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: vendor_service_history vendor_service_history_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history
    ADD CONSTRAINT vendor_service_history_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.marketplace_services(id);


--
-- Name: vendor_service_history vendor_service_history_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendor_service_history
    ADD CONSTRAINT vendor_service_history_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.service_vendors(id);


--
-- Name: welcome_pack_templates welcome_pack_templates_item_id_welcome_pack_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_templates
    ADD CONSTRAINT welcome_pack_templates_item_id_welcome_pack_items_id_fk FOREIGN KEY (item_id) REFERENCES public.welcome_pack_items(id);


--
-- Name: welcome_pack_templates welcome_pack_templates_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_templates
    ADD CONSTRAINT welcome_pack_templates_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: welcome_pack_usage welcome_pack_usage_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_usage
    ADD CONSTRAINT welcome_pack_usage_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: welcome_pack_usage welcome_pack_usage_item_id_welcome_pack_items_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_usage
    ADD CONSTRAINT welcome_pack_usage_item_id_welcome_pack_items_id_fk FOREIGN KEY (item_id) REFERENCES public.welcome_pack_items(id);


--
-- Name: welcome_pack_usage welcome_pack_usage_property_id_properties_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welcome_pack_usage
    ADD CONSTRAINT welcome_pack_usage_property_id_properties_id_fk FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

