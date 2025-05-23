﻿namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record CreateConsignmentRequest(
    long SupplierId,
    DateTime ConsignmentDate,
    IReadOnlyCollection<CreateConsignmentItem> Items);