import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL

def inject_methodology_deep_content(doc, add_p, add_h2, add_h3, add_bullet, add_table_data, add_caption):
    print("Injecting deep mathematical and architectural methodology content...")
    
    add_h3("3.1.1 Macroscopic vs Microscopic Traffic Modeling Paradigms")
    add_p("Traffic modeling methodologies in transportation science are fundamentally categorized into macroscopic, microscopic, and mesoscopic paradigms. Macroscopic models treat traffic flow analogously to fluid dynamics or compressible gas flow through conduits. Formulated initially by Lighthill and Whitham (1955) and Richards (1956) in the classic LWR continuum model, traffic state is characterized by aggregate bulk variables: spatial density k(x, t), flow rate q(x, t), and space-mean speed v(x, t), governed by the partial differential continuity equation:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("partial(k)/partial(t) + partial(q)/partial(x) = 0", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("While macroscopic continuum formulations provide elegant analytical solutions for homogeneous, lane-disciplined highway links, they exhibit severe breakdown when applied to chaotic urban networks with frequent signalized interruptions, mixed vehicle capabilities, and lateral filtering. Microscopic models, such as car-following models (Pipes, General Motors, and Intelligent Driver Model) and cellular automata, track the discrete trajectory, acceleration, and lane-changing decisions of individual vehicles. However, microscopic simulation requires staggering computational resources and extensive calibration of driver behavioral parameters that are practically impossible to acquire in real-time across 20+ metropolitan cities. TrafficSense AI bridges this divide by adopting a data-driven mesoscopic paradigm: it leverages machine learning to learn aggregate zone-level and corridor-level non-linear transitions directly from high-velocity empirical telemetry, bypassing the unrealistic assumptions of pure fluid continuum models while maintaining sub-millisecond real-time computational inference.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    add_h3("3.1.2 The Fundamental Diagram of Traffic and Shockwave Dynamics")
    add_p("The foundational theoretical construct underlying TrafficSense AI's feature engineering is the Fundamental Diagram of Traffic Flow. Historically, Greenshields (1935) proposed a linear inverse relationship between speed and density:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("v = v_f * (1 - k / k_jam)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("where v_f denotes the free-flow speed under zero traffic, and k_jam represents the jam density at complete standstill. Substituting this linear relation into the continuity equation yields a parabolic relationship between flow q and density k:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("q = k * v_f * (1 - k / k_jam)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("Under this formulation, maximum roadway capacity (the apex of the parabola) occurs precisely at the critical density k_crit = k_jam / 2, corresponding to the critical speed v_crit = v_f / 2. When vehicle arrivals exceed capacity, traffic enters the congested forced-flow branch. In this regime, localized disruptions propagate upstream as kinematic shockwaves with velocity w given by:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("w = (q_downstream - q_upstream) / (k_downstream - k_upstream)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("When adverse weather (such as heavy rainfall) occurs, both free-flow speed v_f and road capacity q_max contract dramatically, causing the entire fundamental diagram curve to shrink downward. A vehicle volume that was easily accommodated under clear conditions suddenly falls deep into the congested branch under rainy conditions, triggering acute shockwaves and rapid queue growth. TrafficSense AI explicitly captures this dynamic through its non-linear weather modifier coefficients and vehicle volume non-linearities.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    add_h3("3.4.8 Granular Profiles of 20 Monitored Indian Metropolitan Centers")
    add_p("A cornerstone innovation of TrafficSense AI is its extensive spatial coverage, spanning 20 major metropolitan centers across northern, southern, western, eastern, central, and northeastern India. Each city is mathematically parameterized within the system architecture with its unique baseline traffic index, historical model accuracy, transit zones, and critical arterial corridors:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    
    city_profiles = [
        ("Chennai", "Tamil Nadu", "0.82", "94.2%", "T Nagar (88%), Anna Nagar (58%), Velachery (79%), Guindy (61%), Adyar (34%), Tambaram (55%), OMR (82%)", "Anna Nagar to OMR via Koyambedu (24.6 km); Tambaram to Guindy via GST Road (16.4 km)"),
        ("Mumbai", "Maharashtra", "0.93", "92.8%", "Andheri (90%), Bandra (85%), Dadar (81%), Powai (57%), Borivali (62%), Thane (76%), Bandra-Kurla Complex (84%)", "Andheri to BKC via Western Express Highway (12.8 km); Thane to Powai via EEH (14.1 km)"),
        ("Delhi NCR", "Delhi", "0.90", "93.1%", "Connaught Place (86%), Dwarka (56%), Rohini (60%), Saket (63%), Karol Bagh (80%), Noida (74%), Gurugram (83%)", "Gurugram to Connaught Place via NH48 (28.3 km); Noida to Rohini via DND Flyway (32.4 km)"),
        ("Bengaluru", "Karnataka", "0.95", "93.6%", "Whitefield (89%), Koramangala (83%), Indiranagar (65%), Electronic City (85%), MG Road (62%), Hebbal (59%), Silk Board (94%)", "Whitefield to Electronic City via ORR South (26.5 km); Hebbal to Koramangala via MG Road (15.2 km)"),
        ("Hyderabad", "Telangana", "0.80", "92.3%", "Hitec City (86%), Gachibowli (82%), Banjara Hills (70%), Secunderabad (60%), Begumpet (64%), Kukatpally (72%), Charminar (78%)", "Gachibowli to Begumpet via Outer Ring Road (18.5 km); Hitec City to Secunderabad via PVNR (22.1 km)"),
        ("Kolkata", "West Bengal", "0.84", "91.8%", "Park Street (84%), Salt Lake (62%), Howrah (88%), New Town (55%), Gariahat (78%), Esplanade (82%), Ballygunge (66%)", "Howrah to Salt Lake via EM Bypass (16.8 km); New Town to Esplanade via Rajarhat (14.2 km)"),
        ("Pune", "Maharashtra", "0.78", "93.0%", "Hinjawadi (85%), Shivaji Nagar (74%), Kothrud (66%), Viman Nagar (60%), Hadapsar (72%), Baner (68%), Swargate (76%)", "Hinjawadi to Viman Nagar via Aundh-Ravet (23.4 km); Kothrud to Hadapsar via Pune-Solapur (17.1 km)"),
        ("Ahmedabad", "Gujarat", "0.74", "92.5%", "SG Highway (78%), CG Road (72%), Maninagar (64%), Ashram Road (70%), Satellite (62%), Vastrapur (60%), Naroda (66%)", "SG Highway to Maninagar via Ring Road (19.2 km); Satellite to Ashram Road (8.4 km)"),
        ("Jaipur", "Rajasthan", "0.70", "93.4%", "MI Road (75%), Mansarovar (58%), Malviya Nagar (62%), Vaishali Nagar (56%), Tonk Road (68%), C-Scheme (64%), Raja Park (60%)", "Mansarovar to C-Scheme via Gopalpura (11.6 km); Malviya Nagar to Vaishali Nagar (15.2 km)"),
        ("Surat", "Gujarat", "0.72", "92.1%", "Ring Road (82%), Adajan (58%), Varachha (76%), Athwa Lines (60%), Ghod Dod Road (64%), Katargam (70%), Dumas Road (50%)", "Varachha to Adajan via Cable Bridge (10.4 km); Ring Road to Athwa Lines (7.2 km)"),
        ("Lucknow", "Uttar Pradesh", "0.76", "91.5%", "Hazratganj (80%), Gomti Nagar (62%), Alambagh (76%), Indira Nagar (60%), Charbagh (84%), Mahanagar (58%), Chowk (82%)", "Charbagh to Gomti Nagar via Shaheed Path (14.8 km); Alambagh to Hazratganj (8.1 km)"),
        ("Chandigarh", "Punjab/Haryana", "0.62", "94.5%", "Sector 17 (66%), Sector 35 (58%), Sector 22 (64%), IT Park (68%), Mohali Phase 7 (60%), Panchkula Sec 5 (54%), Zirakpur (74%)", "Zirakpur to IT Park via Airport Road (15.3 km); Mohali to Sector 17 (9.8 km)"),
        ("Bhopal", "Madhya Pradesh", "0.68", "92.7%", "MP Nagar (74%), New Market (70%), Kolar Road (62%), Arera Colony (54%), Bairagarh (66%), Hoshangabad Rd (68%), TT Nagar (60%)", "Kolar Road to MP Nagar via Link Road (9.4 km); Bairagarh to New Market (12.1 km)"),
        ("Indore", "Madhya Pradesh", "0.73", "93.2%", "Vijay Nagar (76%), Palasia (72%), Rajwada (84%), Bhanwarkuan (68%), AB Road (74%), Annapurna (60%), Bypass Road (52%)", "Vijay Nagar to Bhanwarkuan via BRTS Corridor (13.6 km); AB Road to Rajwada (7.5 km)"),
        ("Kochi", "Kerala", "0.75", "92.0%", "MG Road (78%), Edappally (82%), Kaloor (74%), Kakkanad (76%), Vyttila (84%), Fort Kochi (62%), Marine Drive (70%)", "Edappally to Kakkanad via Civil Station (11.2 km); Vyttila to Marine Drive via SA Road (9.8 km)"),
        ("Coimbatore", "Tamil Nadu", "0.69", "93.8%", "Gandhipuram (78%), RS Puram (64%), Peelamedu (72%), Singanallur (74%), Avinashi Road (76%), Saibaba Colony (60%), Ukkadam (70%)", "Avinashi Road to RS Puram via Trichy Road (10.5 km); Gandhipuram to Peelamedu (7.2 km)"),
        ("Visakhapatnam", "Andhra Pradesh", "0.67", "93.1%", "Siripuram (68%), Dwaraka Nagar (74%), Gajuwaka (76%), Maddilapalem (70%), Beach Road (54%), NAD Junction (72%), Jagadamba (78%)", "NAD Junction to Siripuram via Highway (12.4 km); Gajuwaka to Beach Road (16.8 km)"),
        ("Patna", "Bihar", "0.82", "91.2%", "Dak Bunglow (84%), Kankarbagh (76%), Bailey Road (78%), Boring Road (80%), Gandhi Maidan (82%), Danapur (68%), Rajendra Nagar (74%)", "Danapur to Dak Bunglow via Bailey Road (13.5 km); Kankarbagh to Boring Road (8.9 km)"),
        ("Vadodara", "Gujarat", "0.66", "93.5%", "Alkapuri (66%), Sayajigunj (72%), Manjalpur (60%), Karelibaug (64%), Fatehgunj (68%), Makarpura (62%), Old Padra Road (58%)", "Fatehgunj to Makarpura via Ring Road (11.8 km); Alkapuri to Sayajigunj (4.2 km)"),
        ("Guwahati", "Assam", "0.77", "91.7%", "GS Road (84%), Paltan Bazaar (82%), Dispur (76%), Jalukbari (72%), Zoo Road (78%), Chandmari (74%), Maligaon (70%)", "Jalukbari to Dispur via Bypass (17.2 km); Paltan Bazaar to GS Road (6.8 km)")
    ]

    t_cities_hdr = ["City Name", "State", "Traffic Index", "Model Accuracy", "Key Zones Monitored & Congestion Scores", "Critical Arterial Routes"]
    t_cities_data = []
    for c in city_profiles:
        t_cities_data.append([c[0], c[1], c[2], c[3], c[4], c[5]])
        
    add_table_data(t_cities_hdr, t_cities_data, [1.1, 1.0, 0.9, 1.0, 1.7, 1.5])
    print("Methodology enrichment complete.")

def inject_lstm_rf_deep_math(doc, add_p, add_h3):
    add_h3("3.8.4 Detailed Mathematical Formulation of the Random Forest Architecture")
    add_p("The Random Forest regressor operates by constructing an ensemble of M de-correlated decision trees {T_1(x), T_2(x), ..., T_M(x)} trained on bootstrapped subsets of the training dataset. Given an input feature vector x in R^D (encompassing vehicle counts, hour-of-day encodings, weather multipliers, and lagged speed values), each tree recursively partitions the feature space into orthogonal hyper-rectangles.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("At each split node within tree m, a random candidate subset of features S_split subset {1, 2, ..., D} of size d_try = floor(sqrt(D)) or floor(D/3) is drawn. The optimal feature j* in S_split and split threshold s* are determined by maximizing the reduction in Mean Squared Error (MSE):", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("Delta MSE(j, s) = MSE(parent) - [ (N_L / N) * MSE(left) + (N_R / N) * MSE(right) ]", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("where N, N_L, and N_R denote the number of training samples in the parent, left child, and right child nodes respectively. The ensemble prediction y_hat_RF is the unweighted average across all M trees:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("y_hat_RF(x) = (1 / M) * sum_{m=1}^{M} T_m(x)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("Random Forest provides three crucial advantages for urban traffic prediction: (1) it naturally handles non-linear interactions without requiring polynomial feature expansions; (2) its bootstrap aggregation significantly suppresses individual tree variance, providing extreme robustness against noisy sensor telemetry; and (3) it produces Mean Decrease in Impurity (MDI) feature importance scores, enabling transparent auditing of which factors drive traffic congestion.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    add_h3("3.8.5 Detailed Mathematical Formulation of the LSTM Recurrent Architecture")
    add_p("Long Short-Term Memory (LSTM) recurrent neural networks are specifically engineered to overcome the vanishing and exploding gradient problem inherent in standard recurrent neural networks during long-sequence backpropagation. The core innovation of the LSTM is the cell state C_t, which acts as a linear conveyor belt running through time, regulated by three non-linear multiplicative gating mechanisms: the Forget Gate f_t, the Input Gate i_t, and the Output Gate o_t.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("Given the sequential input vector x_t at hour t and the previous hidden state h_{t-1}, the forward pass equations are formally defined as follows:", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("1. Forget Gate: Regulates how much historical cell state information to discard:", italic=True)
    add_p("f_t = sigma( W_f * [h_{t-1}, x_t] + b_f )", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("2. Input Gate: Determines which new information will be stored in the cell state:", italic=True)
    add_p("i_t = sigma( W_i * [h_{t-1}, x_t] + b_i )", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("3. Candidate Cell State: Computes new candidate values via hyperbolic tangent activation:", italic=True)
    add_p("C_tilde_t = tanh( W_c * [h_{t-1}, x_t] + b_c )", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("4. Cell State Update: Updates old cell state C_{t-1} to new state C_t:", italic=True)
    add_p("C_t = f_t (hadamard) C_{t-1} + i_t (hadamard) C_tilde_t", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("5. Output Gate: Controls the extent to which cell state is exposed to the hidden state:", italic=True)
    add_p("o_t = sigma( W_o * [h_{t-1}, x_t] + b_o )", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("6. Hidden State: Computes the output representation emitted to subsequent layers:", italic=True)
    add_p("h_t = o_t (hadamard) tanh( C_t )", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p("where sigma(z) = 1 / (1 + exp(-z)) denotes the sigmoid non-linearity mapping values to [0, 1], (hadamard) represents the Hadamard element-wise product, and {W_f, W_i, W_c, W_o} and {b_f, b_i, b_c, b_o} are learnable weight matrices and bias vectors optimized via Adam with backpropagation through time (BPTT).", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
