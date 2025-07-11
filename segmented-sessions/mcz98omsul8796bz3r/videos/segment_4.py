from manim import *

class FormalizingConnections(Scene):
    def construct(self):

        title = Text("Formalizing Connections", font_size=48)
        self.play(Write(title))
        self.wait(1)

        vertex_a = Dot(point=LEFT * 3)
        vertex_b = Dot(point=RIGHT * 3)
        vertex_c = Dot(point=UP * 2)
        vertex_d = Dot(point=DOWN * 2)

        vertices = VGroup(vertex_a, vertex_b, vertex_c, vertex_d)
        vertex_labels = VGroup(
            Text("A").next_to(vertex_a, DOWN),
            Text("B").next_to(vertex_b, DOWN),
            Text("C").next_to(vertex_c, DOWN),
            Text("D").next_to(vertex_d, DOWN)
        )

        edges_ab = Line(vertex_a.get_center(), vertex_b.get_center())
        edges_ac = Line(vertex_a.get_center(), vertex_c.get_center())
        edges_ad = Line(vertex_a.get_center(), vertex_d.get_center())

        self.play(FadeIn(vertices), Write(vertex_labels))
        self.wait(1)

        self.play(Create(edges_ab), Create(edges_ac), Create(edges_ad))
        self.wait(1)

        degree_label = Text("Degree of A=3", font_size=36).next_to(vertex_a, UP)
        self.play(Write(degree_label))
        self.wait(1)

        self.play(FadeOut(degree_label), FadeOut(edges_ab), FadeOut(edges_ac), FadeOut(edges_ad))
        self.wait(0.5)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        social_network_title = Text("Social Network Representation", font_size=36)
        self.play(Write(social_network_title))
        self.wait(1)

        alex = Dot(point=LEFT * 4)
        bridget = Dot(point=RIGHT * 4)
        alex_label = Text("Alex").next_to(alex, DOWN)
        bridget_label = Text("Bridget").next_to(bridget, DOWN)

        self.play(FadeIn(alex), FadeIn(bridget), Write(alex_label), Write(bridget_label))
        self.wait(1)

        final_message = Text("Connections Matter!", font_size=48)
        self.play(Write(final_message))
        self.wait(1)

        self.play(FadeOut(final_message), FadeOut(alex), FadeOut(bridget), FadeOut(alex_label), FadeOut(bridget_label), FadeOut(social_network_title))
        self.wait(1)

        self.wait(7.4)  # Adjust to make total duration exactly 44.4 seconds