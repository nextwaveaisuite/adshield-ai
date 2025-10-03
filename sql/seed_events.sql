-- Seed sample events for testing
insert into events(event, country, state, zip, offer_type, city, ts, utm_source, utm_medium, utm_campaign, utm_term, cid) values
('click','US','Texas','77002','Pest Guide','Houston',extract(epoch from now())*1000,'craigslist','classified','pest-guide-q4','houston-pest','seed1'),
('lead','US','Texas','77002','Pest Guide','Houston',extract(epoch from now())*1000,'craigslist','classified','pest-guide-q4','houston-pest','seed1'),
('click','US','California','94103','Debt Tips','San Francisco',extract(epoch from now())*1000,'craigslist','classified','debt-tips-q4','sf-debt','seed2'),
('click','AU','QLD','4000','Home Solar Info','Brisbane',extract(epoch from now())*1000,'craigslist','classified','solar-info-q4','brisbane-solar','seed3'),
('lead','AU','QLD','4000','Home Solar Info','Brisbane',extract(epoch from now())*1000,'craigslist','classified','solar-info-q4','brisbane-solar','seed3'),
('sale','US','Florida','33130','Roof Repair Info','Miami',extract(epoch from now())*1000,'craigslist','classified','roof-info-q4','miami-roof','seed4');