USE [Drive-Lounge]
GO
/****** Object:  StoredProcedure [dbo].[sp_rept_admin]    Script Date: 9/29/2024 9:51:56 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Chandran N
-- =============================================
ALTER procEDURE [dbo].[sp_rept_admin]
	-- Add the parameters for the stored procedure here
	@agentid int,
	@fromdate datetime,
	@todate datetime	--@lang int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	IF(@agentid > 0)
		Begin
        select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from  
		(
			select bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', d.firstname + ' '+ d.lastname 'agentname', bk.priceperday,
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,ci.carpriceperday, bk.vatpercent,  (select commissiontype from dappconfig where status = 1) 'commtype', (select commissionvalue from dappconfig where status = 1) 'commvalue',bk.couponvalue
			from [Drive-Lounge].dbo.dbooking bk inner join 
			[Drive-Lounge].dbo.dagent d on d.id = bk.agentid inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where convert(date,bk.created_at) between convert(date, @fromdate) and convert(date, @todate) and bk.agentid = @agentid
			and bk.bookingstatus = 3 and bk.status = 1
        ) tmp
		End
    Else
		Begin
        select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from  
		(
			select bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', d.firstname + ' '+ d.lastname 'agentname' , 
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,bk.priceperday,
			ci.carpriceperday, bk.vatpercent, (select commissiontype from dappconfig where status = 1) 'commtype', (select commissionvalue from dappconfig where status = 1) 'commvalue',bk.couponvalue
			from [Drive-Lounge].dbo.dbooking bk inner join
			[Drive-Lounge].dbo.dagent d on d.id = bk.agentid inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where convert(date,bk.created_at) between convert(date, @fromdate) and convert(date, @todate)
			and bk.bookingstatus = 3 and bk.status = 1
        ) tmp
		End
END;


USE [Drive-Lounge]
GO
/****** Object:  StoredProcedure [dbo].[sp_rept_agency_new]    Script Date: 9/29/2024 12:40:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
/*
	sp_rept_agency 11, '01/01/2023', '12/12/2023', 0, 0
	sp_rept_agency 0, '01/01/2023', '12/12/2023', 0, 0
*/
-- =============================================
ALTER procEDURE [dbo].[sp_rept_agency_new]
	-- Add the parameters for the stored procedure here
	@agentid int,
	@fromdate datetime,
	@todate datetime,
	@bookingno bigint,
	@carno int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF(@bookingno > 0)
	Begin
		select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from 
		(
			select distinct bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', bk.priceperday,
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,ci.carpriceperday, bk.vatpercent,  (select commissiontype from dappconfig where status = 1) 'commtype', bk.couponvalue,bk.couponcode,
			(select commissionvalue from dappconfig where status = 1) 'commvalue', IsNull((select SUM(isnull(paid,0)) from dpayment where bookingid = bk.id and status = 0),0) 'balance'
			from [Drive-Lounge].dbo.dbooking bk inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where convert(date,bk.created_at) between convert(date, @fromdate) and convert(date, @todate)
			and (bk.agentid = @agentid OR @agentid = 0)
			and bk.bookingstatus = 3 and bk.status = 1 and bk.bookingcode =@bookingno
		) tmp
	End
	Else IF(@carno > 0)
	Begin
		select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from  
		(
			select distinct bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', bk.priceperday,
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,ci.carpriceperday, bk.vatpercent,  (select commissiontype from dappconfig where status = 1) 'commtype', bk.couponvalue,bk.couponcode,
			(select commissionvalue from dappconfig where status = 1) 'commvalue', IsNull((select SUM(isnull(paid,0)) from dpayment where bookingid = bk.id and status = 0),0) 'balance'
			from [Drive-Lounge].dbo.dbooking bk inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where convert(date,bk.created_at) between convert(date, @fromdate) and convert(date, @todate) 
			and (bk.agentid = @agentid OR @agentid = 0)
			and bk.bookingstatus = 3 and bk.status = 1 and ci.carno =@carno
		) tmp
	End
	Else IF (@bookingno > 0 and @carno > 0)
	Begin
		select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from  
		(
			select distinct bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', bk.priceperday,
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,ci.carpriceperday, bk.vatpercent,  (select commissiontype from dappconfig where status = 1) 'commtype', bk.couponvalue,bk.couponcode,
			(select commissionvalue from dappconfig where status = 1) 'commvalue', IsNull((select SUM(isnull(paid,0)) from dpayment where bookingid = bk.id and status = 0),0) 'balance'
			from [Drive-Lounge].dbo.dbooking bk inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where convert(date,bk.created_at) between convert(date, @fromdate) and convert(date, @todate) 
			and (bk.agentid = @agentid OR @agentid = 0)
			and bk.bookingstatus = 3 and bk.status = 1 and bk.bookingcode =@bookingno and ci.carno = @carno
		) tmp
	End
	Else
	Begin
		select
		CASE
		WHEN commtype = 1 THEN
			(commvalue - couponvalue)
		WHEN commtype = 2 THEN
			((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue)
		END as admincomission,
		CASE
		WHEN commtype = 1 THEN
			((commvalue - couponvalue) * vatpercent / 100)
		WHEN commtype = 2 THEN
			(((carpriceperday * totalrentaldays * commvalue / 100)  - couponvalue) * vatpercent / 100)
		END as adminvat,
		tmp.*
		from  
		(
			select distinct bk.id, bk.created_at 'bookingdate', bookingcode,bk.pickupdate, bk.dropoffdate, cast(totalcost as decimal(16,2)) 'totalcost', ci.carno, u.firstname + ' '+ u.lastname 'customername', bk.priceperday,
			bk.totalrentaldays,bk.deposit, bk.subtotal, bk.vatamount,ci.carpriceperday, bk.vatpercent,  (select commissiontype from dappconfig where status = 1) 'commtype', bk.couponvalue,bk.couponcode,
			(select commissionvalue from dappconfig where status = 1) 'commvalue', IsNull((select SUM(isnull(paid,0)) from dpayment where bookingid = bk.id and status = 0),0) 'balance'
			from [Drive-Lounge].dbo.dbooking bk inner join
			[Drive-Lounge].dbo.dcarinformation ci on ci.id = bk.carid inner join
			[Drive-Lounge].dbo.duser u on u.id = bk.created_by
			where bk.created_at >= convert(date, @fromdate) and bk.created_at <= convert(date, @todate) 
			and (bk.agentid = @agentid OR @agentid = 0)
			and bk.bookingstatus = 3 and bk.status = 1
		) tmp
	End
	

END
