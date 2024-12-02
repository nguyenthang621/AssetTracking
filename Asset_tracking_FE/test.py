from pyasn1.codec.der import decoder
from pyasn1.type import univ, namedtype

# Định nghĩa kiểu dữ liệu ASN.1 cho EXTENSION
class Extension(univ.Sequence):
    componentType = namedtype.NamedTypes(
        namedtype.NamedType('extensionType', univ.Integer()),  # &ExtensionType
        namedtype.NamedType('criticality', univ.Enumerated(
            namedtype.NamedValues(
                ('ignore', 0),
                ('abort', 1)
            )
        )),  # &criticality
        namedtype.NamedType('id', univ.Integer())  # &id
    )

# Mã hex của bạn
hex_data = "30240604040001020a0100a11980010f8101138211cd701e240cbb414d39c87946a7c320ab13"

# Chuyển đổi mã hex thành nhị phân
binary_data = bytes.fromhex(hex_data)

# Giải mã dữ liệu nhị phân
decoded_data, _ = decoder.decode(binary_data, asn1Spec=Extension())

# In kết quả
print("Decoded EXTENSION:")
print("Extension Type:", decoded_data.getComponentByName('extensionType'))
print("Criticality:", decoded_data.getComponentByName('criticality'))
print("ID:", decoded_data.getComponentByName('id'))
